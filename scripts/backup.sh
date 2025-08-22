#!/bin/bash

# Backup Script for Yahska Polymers
# This script creates automated backups of the database and media files

set -e

# Configuration
BACKUP_DIR="./backups"
DB_FILE="./admin.db"
MEDIA_DIR="./public/media"
MAX_BACKUPS=30
DATE_FORMAT=$(date +%Y%m%d-%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    log "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# Create subdirectories
mkdir -p "$BACKUP_DIR/database"
mkdir -p "$BACKUP_DIR/media"
mkdir -p "$BACKUP_DIR/full"

log "Starting backup process..."

# Database backup
if [ -f "$DB_FILE" ]; then
    log "Backing up database..."
    DB_BACKUP="$BACKUP_DIR/database/admin-$DATE_FORMAT.db"
    cp "$DB_FILE" "$DB_BACKUP"
    
    # Compress database backup
    gzip "$DB_BACKUP"
    log "Database backup created: $DB_BACKUP.gz"
    
    # Verify backup integrity
    if sqlite3 "$DB_FILE" "PRAGMA integrity_check;" | grep -q "ok"; then
        log "Database integrity verified"
    else
        warn "Database integrity check failed"
    fi
else
    error "Database file not found: $DB_FILE"
fi

# Media files backup
if [ -d "$MEDIA_DIR" ]; then
    log "Backing up media files..."
    MEDIA_BACKUP="$BACKUP_DIR/media/media-$DATE_FORMAT.tar.gz"
    
    # Create tar archive of media files
    tar -czf "$MEDIA_BACKUP" -C "$(dirname "$MEDIA_DIR")" "$(basename "$MEDIA_DIR")"
    log "Media backup created: $MEDIA_BACKUP"
    
    # Verify media backup
    if tar -tzf "$MEDIA_BACKUP" > /dev/null 2>&1; then
        log "Media backup verified"
    else
        warn "Media backup verification failed"
    fi
else
    warn "Media directory not found: $MEDIA_DIR"
fi

# Full system backup (including code)
log "Creating full system backup..."
FULL_BACKUP="$BACKUP_DIR/full/system-$DATE_FORMAT.tar.gz"

# Exclude unnecessary files from full backup
tar -czf "$FULL_BACKUP" \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='backups' \
    --exclude='*.log' \
    --exclude='.env' \
    .

log "Full system backup created: $FULL_BACKUP"

# Cleanup old backups
log "Cleaning up old backups..."
cleanup_old_backups() {
    local backup_type=$1
    local max_count=$2
    
    # Count current backups
    local count=$(ls -1 "$BACKUP_DIR/$backup_type"/*.gz 2>/dev/null | wc -l)
    
    if [ "$count" -gt "$max_count" ]; then
        local to_delete=$((count - max_count))
        log "Removing $to_delete old $backup_type backup(s)..."
        
        # Remove oldest backups
        ls -t "$BACKUP_DIR/$backup_type"/*.gz 2>/dev/null | tail -n "$to_delete" | xargs rm -f
    fi
}

cleanup_old_backups "database" $MAX_BACKUPS
cleanup_old_backups "media" $MAX_BACKUPS
cleanup_old_backups "full" $MAX_BACKUPS

# Create backup summary
BACKUP_SUMMARY="$BACKUP_DIR/backup-summary-$DATE_FORMAT.txt"
{
    echo "Yahska Polymers Backup Summary"
    echo "=============================="
    echo "Date: $(date)"
    echo "Backup ID: $DATE_FORMAT"
    echo ""
    echo "Files Created:"
    echo "- Database: $BACKUP_DIR/database/admin-$DATE_FORMAT.db.gz"
    echo "- Media: $BACKUP_DIR/media/media-$DATE_FORMAT.tar.gz"
    echo "- Full System: $BACKUP_DIR/full/system-$DATE_FORMAT.tar.gz"
    echo ""
    echo "Backup Statistics:"
    echo "- Database size: $(du -h "$DB_FILE" | cut -f1)"
    echo "- Media size: $(du -sh "$MEDIA_DIR" | cut -f1)"
    echo "- Total backup size: $(du -sh "$BACKUP_DIR" | cut -f1)"
    echo ""
    echo "Next backup: $(date -d '+1 day' +'%Y-%m-%d %H:%M:%S')"
} > "$BACKUP_SUMMARY"

log "Backup summary created: $BACKUP_SUMMARY"

# Final status
log "Backup process completed successfully!"
log "Backup location: $BACKUP_DIR"
log "Total backup size: $(du -sh "$BACKUP_DIR" | cut -f1)"

# Optional: Send notification (uncomment and configure as needed)
# if command -v mail &> /dev/null; then
#     echo "Backup completed successfully at $(date)" | mail -s "Yahska Polymers Backup" admin@example.com
# fi

# Optional: Upload to cloud storage (uncomment and configure as needed)
# if command -v aws &> /dev/null; then
#     log "Uploading backup to S3..."
#     aws s3 cp "$BACKUP_DIR" "s3://your-bucket/backups/" --recursive
# fi

exit 0
