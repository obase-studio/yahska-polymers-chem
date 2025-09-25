-- Migration: Add project_info_details column to projects table
-- This field will store additional project information to be displayed below the main description

ALTER TABLE projects
ADD COLUMN project_info_details TEXT;

COMMENT ON COLUMN projects.project_info_details IS 'Additional project information to display below the main description';