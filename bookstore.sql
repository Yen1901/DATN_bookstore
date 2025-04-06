CREATE DATABASE bookstore;
USE bookstore;

-- Bảng người dùng
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name NVARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) UNIQUE NULL,
    role ENUM('customer', 'seller', 'admin') NOT NULL,
    gender ENUM('male', 'female'),
    user_birthday DATETIME NOT NULL,
    address NVARCHAR(255) NOT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng tác giả
CREATE TABLE authors (
    author_id INT PRIMARY KEY AUTO_INCREMENT,
    author_name NVARCHAR(255) NOT NULL,
    gender ENUM('male', 'female'),
    author_birthday DATETIME NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng thể loại sách
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name NVARCHAR(255) NOT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng nhà xuất bản
CREATE TABLE publishers (
    publisher_id INT PRIMARY KEY AUTO_INCREMENT,
    publisher_name NVARCHAR(255) NOT NULL,
    is_blocked BOOLEAN DEFAULT FALSE,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng sản phẩm (Sách)
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    title NVARCHAR(255) NOT NULL,
    image_url TEXT,
    summary VARCHAR(1000) NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    sold_quantity INT NOT NULL DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    author_id INT,
    category_id INT,
    publisher_id INT,
    seller_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng giỏ hàng
CREATE TABLE carts (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    quantity INT NOT NULL DEFAULT 1,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Bảng đơn hàng
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    total_price DECIMAL(10,2) NOT NULL,
    status TINYINT(1) DEFAULT 0 CHECK (status BETWEEN 0 AND 3),
    shipping_address NVARCHAR(255) NOT NULL,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    voucher_id INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (voucher_id) REFERENCES vouchers(voucher_id) ON DELETE NO ACTION
);

-- Bảng chi tiết đơn hàng
CREATE TABLE order_details (
    order_detail_id INT PRIMARY KEY AUTO_INCREMENT,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Bảng đánh giá
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    comment TEXT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Bảng mã giảm giá
CREATE TABLE vouchers (
    voucher_id INT PRIMARY KEY AUTO_INCREMENT,
    code NVARCHAR(255) NOT NULL UNIQUE,
    discount DECIMAL(5,2) NOT NULL CHECK (discount BETWEEN 0 AND 100),
    min_order_value DECIMAL(10,2) NOT NULL DEFAULT 0, 
    valid_from DATETIME,
    valid_to DATETIME,
    max_usage INT DEFAULT 1,
    usage_count INT DEFAULT 0,
    create_by INT NOT NULL,
    create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (create_by) REFERENCES users(user_id) ON DELETE CASCADE
);
