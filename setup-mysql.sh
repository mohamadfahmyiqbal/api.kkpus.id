#!/bin/bash
echo "=== MySQL Setup for KKPUS API ==="

# Check if mysql command exists
if ! command -v mysql &> /dev/null; then
    echo "Installing MySQL..."
    sudo apt-get update
    sudo apt-get install -y mysql-server mysql-client
fi

# Check if mysql command is available
if command -v mysql &> /dev/null; then
    echo "MySQL is installed. Checking if service is running..."
    
    if ! sudo systemctl is-active --quiet mysql; then
        echo "Starting MySQL service..."
        sudo systemctl start mysql
        sudo systemctl enable mysql
    fi
    
    # Create database and user
    MYSQL_ROOT_PASSWORD="root_password"
    DB_USER="kkpusid"
    DB_PASSWORD="your_password_here"
    DB_NAME="koperasi"
    
    echo "Creating database and user..."
    
    sudo mysql << EOF
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    
-- Create user if it doesn't exist
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
    
-- Grant all privileges
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
    
-- Flush privileges
FLUSH PRIVILEGES;
EOF

echo "MySQL database setup completed successfully!"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Connection: localhost:3306"