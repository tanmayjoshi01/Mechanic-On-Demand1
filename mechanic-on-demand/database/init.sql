-- Initialize database with sample data
USE mechanic_on_demand;

-- Insert sample admin user
INSERT INTO users (username, email, password, full_name, phone_number, address, city, pincode, role, is_active, created_at, updated_at) VALUES
('admin', 'admin@mechanicondemand.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'System Administrator', '9999999999', 'Admin Office', 'Mumbai', '400001', 'ADMIN', true, NOW(), NOW());

-- Insert sample customer
INSERT INTO users (username, email, password, full_name, phone_number, address, city, pincode, role, is_active, created_at, updated_at) VALUES
('customer1', 'customer@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'John Doe', '9876543210', '123 Main Street', 'Mumbai', '400001', 'CUSTOMER', true, NOW(), NOW());

-- Insert sample mechanic user
INSERT INTO users (username, email, password, full_name, phone_number, address, city, pincode, role, is_active, created_at, updated_at) VALUES
('mechanic1', 'mechanic@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Mike Wilson', '9876543211', '456 Service Road', 'Mumbai', '400001', 'MECHANIC', true, NOW(), NOW());

-- Insert sample mechanic profile
INSERT INTO mechanics (user_id, skills, description, hourly_rate, years_of_experience, certifications, is_available, is_verified, rating, total_reviews, created_at, updated_at) VALUES
(3, 'Engine repair, Brake service, AC repair, Electrical work', 'Experienced mechanic with 10+ years in automotive repair. Specialized in all types of vehicles.', 500.00, 10, 'ASE Certified, Automotive Technology Diploma', true, true, 4.5, 25, NOW(), NOW());

-- Note: Default password for all sample users is 'password'