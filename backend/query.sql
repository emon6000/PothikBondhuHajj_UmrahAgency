-- Active: 1778156147717@@127.0.0.1@5432@hajj_umrah_db
-- 1. Create Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    nid VARCHAR(50) UNIQUE,
    passport VARCHAR(50) UNIQUE,
    role VARCHAR(10) DEFAULT 'CLIENT',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Packages Table
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    cost INT NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    package_id UUID REFERENCES packages(id),
    status VARCHAR(50) DEFAULT 'PENDING_APPROVAL',
    total_cost INT NOT NULL,
    amount_paid INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Document Requests Table
CREATE TABLE document_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    document_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'REQUESTED',
    file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    amount INT NOT NULL,
    method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * from users;