#!/bin/bash

# Yahska Polymers Data Migration Runner
# This script provides an easy interface to execute the comprehensive data migration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo
    echo "======================================================"
    echo "🚀 $1"
    echo "======================================================"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_info "Node.js version: $NODE_VERSION"
}

# Check if required dependencies are installed
check_dependencies() {
    print_info "Checking dependencies..."
    
    if [ ! -d "node_modules" ]; then
        print_warning "Dependencies not installed. Installing now..."
        npm install
    fi
    
    # Check for required packages
    REQUIRED_PACKAGES=("better-sqlite3" "xlsx")
    for package in "${REQUIRED_PACKAGES[@]}"; do
        if [ ! -d "node_modules/$package" ]; then
            print_error "Required package '$package' is not installed."
            print_info "Installing missing packages..."
            npm install
            break
        fi
    done
    
    print_success "Dependencies check completed"
}

# Create backup of current database
create_backup() {
    if [ -f "admin.db" ]; then
        BACKUP_NAME="admin-backup-$(date +%Y%m%d-%H%M%S).db"
        cp admin.db "$BACKUP_NAME"
        print_success "Database backup created: $BACKUP_NAME"
    else
        print_warning "No existing database found to backup"
    fi
}

# Show migration menu
show_menu() {
    print_header "Yahska Polymers Data Migration Tool"
    echo "Select migration option:"
    echo
    echo "1) Full Migration (Recommended)"
    echo "2) Dry Run (Preview without changes)"
    echo "3) Step-by-Step Migration"
    echo "4) Individual Components"
    echo "5) Data Validation Only"
    echo "6) Content Population Only"
    echo "7) Rollback Migration"
    echo "8) View Migration Logs"
    echo "9) Exit"
    echo
    read -p "Enter your choice (1-9): " choice
}

# Execute full migration
run_full_migration() {
    print_header "Full Migration Execution"
    print_warning "This will migrate all data to the database."
    read -p "Are you sure you want to proceed? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        create_backup
        print_info "Starting full migration..."
        node scripts/migration-execution-plan.js --verbose
        
        if [ $? -eq 0 ]; then
            print_success "Migration completed successfully!"
            print_info "Running post-migration validation..."
            node scripts/data-validation-qa.js --export
        else
            print_error "Migration failed. Check logs for details."
            print_info "You can use option 7 to rollback if needed."
        fi
    else
        print_info "Migration cancelled."
    fi
}

# Execute dry run
run_dry_run() {
    print_header "Dry Run Migration"
    print_info "This will simulate the migration without making any changes."
    
    node scripts/migration-execution-plan.js --dry-run --verbose
    
    if [ $? -eq 0 ]; then
        print_success "Dry run completed successfully!"
        print_info "No changes were made to the database."
    else
        print_error "Dry run failed. Please check the output above."
    fi
}

# Execute step-by-step migration
run_step_by_step() {
    print_header "Step-by-Step Migration"
    print_warning "This will execute migration with manual confirmation for each step."
    print_info "You can stop at any point by pressing Ctrl+C."
    
    read -p "Are you sure you want to proceed? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        create_backup
        node scripts/migration-execution-plan.js --step-by-step --verbose
        
        if [ $? -eq 0 ]; then
            print_success "Step-by-step migration completed!"
        else
            print_error "Migration stopped or failed."
        fi
    else
        print_info "Step-by-step migration cancelled."
    fi
}

# Individual components menu
run_individual_components() {
    print_header "Individual Components Migration"
    echo "Select component to migrate:"
    echo
    echo "1) Products Import (Excel files)"
    echo "2) Projects Population (Photo directories)"
    echo "3) Media Asset Organization"
    echo "4) Content Population"
    echo "5) Back to main menu"
    echo
    read -p "Enter your choice (1-5): " comp_choice
    
    case $comp_choice in
        1)
            print_info "Importing products from Excel files..."
            node scripts/import-excel-products.js
            ;;
        2)
            print_info "Populating projects from photo directories..."
            node scripts/comprehensive-migration-plan.js --projects-only
            ;;
        3)
            print_info "Organizing media assets..."
            node scripts/organize-media-assets.js
            ;;
        4)
            print_info "Populating content..."
            node scripts/content-extractor.js --verbose
            ;;
        5)
            return
            ;;
        *)
            print_error "Invalid choice. Please select 1-5."
            ;;
    esac
    
    if [ $? -eq 0 ] && [ $comp_choice -ne 5 ]; then
        print_success "Component migration completed!"
        print_info "Consider running validation: node scripts/data-validation-qa.js"
    fi
}

# Run data validation only
run_validation_only() {
    print_header "Data Validation & Quality Assurance"
    print_info "Running comprehensive data validation..."
    
    node scripts/data-validation-qa.js --export --verbose
    
    if [ $? -eq 0 ]; then
        print_success "Validation completed successfully!"
        print_info "Check validation-reports/ directory for detailed reports."
    else
        print_error "Validation found issues. Check the output above."
    fi
}

# Run content population only
run_content_only() {
    print_header "Content Population"
    print_info "Populating content from templates..."
    
    node scripts/content-extractor.js --verbose
    
    if [ $? -eq 0 ]; then
        print_success "Content population completed!"
    else
        print_error "Content population failed."
    fi
}

# Execute rollback
run_rollback() {
    print_header "Migration Rollback"
    print_error "WARNING: This will revert all migration changes!"
    print_info "This action cannot be undone."
    
    read -p "Are you absolutely sure you want to rollback? (y/N): " confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        print_warning "Executing rollback..."
        node scripts/migration-execution-plan.js --rollback
        
        if [ $? -eq 0 ]; then
            print_success "Rollback completed successfully!"
        else
            print_error "Rollback failed. Manual intervention may be required."
        fi
    else
        print_info "Rollback cancelled."
    fi
}

# View migration logs
view_logs() {
    print_header "Migration Logs"
    
    if [ -d "migration-logs" ] && [ "$(ls -A migration-logs)" ]; then
        echo "Available log files:"
        ls -la migration-logs/
        echo
        read -p "Enter log file name to view (or press Enter to skip): " log_file
        
        if [ ! -z "$log_file" ] && [ -f "migration-logs/$log_file" ]; then
            print_info "Displaying log file: $log_file"
            echo "----------------------------------------"
            tail -50 "migration-logs/$log_file"
            echo "----------------------------------------"
            print_info "Showing last 50 lines. Use 'cat migration-logs/$log_file' to view full log."
        elif [ ! -z "$log_file" ]; then
            print_error "Log file not found: $log_file"
        fi
    else
        print_warning "No migration logs found."
        print_info "Logs will be created when you run migrations."
    fi
}

# Check system requirements
check_requirements() {
    print_info "Checking system requirements..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "Please run this script from the project root directory."
        exit 1
    fi
    
    # Check Node.js
    check_node
    
    # Check dependencies
    check_dependencies
    
    # Check client documentation
    if [ ! -d "client_documentation" ]; then
        print_error "client_documentation directory not found."
        print_info "Please ensure the client documentation is available."
        exit 1
    fi
    
    # Check for required Excel files
    if [ ! -f "client_documentation/Products Catalogue.xlsx" ]; then
        print_warning "Products Catalogue.xlsx not found in client_documentation/"
    fi
    
    print_success "System requirements check completed"
}

# Main execution
main() {
    # Check requirements first
    check_requirements
    
    # Main menu loop
    while true; do
        show_menu
        
        case $choice in
            1)
                run_full_migration
                ;;
            2)
                run_dry_run
                ;;
            3)
                run_step_by_step
                ;;
            4)
                run_individual_components
                ;;
            5)
                run_validation_only
                ;;
            6)
                run_content_only
                ;;
            7)
                run_rollback
                ;;
            8)
                view_logs
                ;;
            9)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please select 1-9."
                ;;
        esac
        
        echo
        read -p "Press Enter to return to main menu..."
    done
}

# Execute main function
main