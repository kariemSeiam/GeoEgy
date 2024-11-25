# GeoEgy Backend Documentation 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)

---

## 📖 Table of Contents

1. [🌟 Project Overview](#-project-overview)
2. [🛠️ Setup and Installation](#️-setup-and-installation)
3. [⚙️ Configuration](#️-configuration)
4. [🚀 Running the Server](#-running-the-server)
5. [📡 API Endpoints](#-api-endpoints)
   - [👤 User Endpoints](#-user-endpoints)
   - [📦 Order Endpoints](#-order-endpoints)
   - [🛡️ Admin Endpoints](#️-admin-endpoints)
6. [🗃️ Database Models](#️-database-models)
7. [🔄 Background Tasks](#-background-tasks)
8. [🛑 Error Handling](#-error-handling)
9. [⏱️ Rate Limiting](#️-rate-limiting)
10. [🔒 Security](#-security)
11. [📜 Database Migrations](#-database-migrations)
12. [📚 Dependencies](#-dependencies)
13. [🔧 Utilities](#-utilities)
14. [📁 Project Structure](#-project-structure)
15. [✍️ Contributing](#️-contributing)
16. [📄 License](#-license)
17. [📫 Contact](#-contact)

---

## 🌟 Project Overview

**GeoEgy** is a robust backend system built with Flask, designed to manage and process geographical data related to places in Egypt. Leveraging modern technologies and best practices, it offers secure user authentication, efficient order management, administrative controls, and seamless integration with WhatsApp for real-time notifications.

### 🎯 Key Objectives

- **Scalability**: Designed to handle a growing number of users and orders.
- **Security**: Implements JWT authentication, rate limiting, and security headers.
- **Asynchronous Processing**: Utilizes Celery for handling long-running tasks without blocking the main application.
- **User-Friendly API**: Provides clear and consistent API endpoints for frontend integration.
- **Comprehensive Logging**: Ensures all actions and errors are logged for monitoring and debugging.

---

## 🛠️ Setup and Installation

### 📝 Prerequisites

- **Python 3.7+**
- **Redis**: Required for Celery broker and backend.
- **Git**: For version control (optional but recommended).

### 🔧 Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/kariemSeiam/GeoEgy/.git
   cd GeoEgy/Backend
   ```

2. **Create a Virtual Environment**

   It's recommended to use a virtual environment to manage dependencies.

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**

   Install all required Python packages using `requirements.txt`.

   ```bash
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**

   Create a `.env` file in the `Backend` directory and populate it with the necessary environment variables. Below is a sample:

   ```env
   SECRET_KEY=your_secret_key
   JWT_SECRET_KEY=your_jwt_secret_key
   DATABASE_URI=sqlite:///database.db
   CELERY_BROKER_URL=redis://localhost:6379/0
   CELERY_RESULT_BACKEND=redis://localhost:6379/0
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

   **Note**: Replace the placeholder values with your actual credentials. For production environments, ensure that sensitive information is securely managed.

5. **Initialize the Database**

   Perform database migrations to set up the initial schema.

   ```bash
   flask db init
   flask db migrate -m "Initial migration."
   flask db upgrade
   ```

6. **Start Redis Server**

   Ensure that Redis is running, as it's required for Celery.

   ```bash
   redis-server
   ```

   **Note**: Install Redis from [https://redis.io/download](https://redis.io/download) if not already installed.

---

## ⚙️ Configuration

The application configuration is managed via the `config.py` file, which loads environment variables and sets default values.

```python
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_jwt_secret_key')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_jwt_secret_key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///database.db')
    JWT_ACCESS_TOKEN_EXPIRES = False  # Tokens never expire for simplicity
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Celery Configuration
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
    CELERY_INCLUDE = ['tasks']  # Provide directly as a list
    CELERY_ACCEPT_CONTENT = ['json']
    CELERY_TASK_SERIALIZER = 'json'
    CELERY_RESULT_SERIALIZER = 'json'
    CELERY_ENABLE_UTC = True
    # Rate Limiting
    RATELIMIT_DEFAULT = '200 per day;50 per hour'
    # Security Headers via Flask-Talisman
    TALISMAN_CONTENT_SECURITY_POLICY = None  # Customize as needed
```

**Key Configuration Parameters:**

- **SECRET_KEY & JWT_SECRET_KEY**: Used for session management and JWT token encryption.
- **DATABASE_URI**: Specifies the database location.
- **Celery Settings**: Configure the broker and backend URLs, task serialization, and more.
- **Rate Limiting**: Sets default rate limits for API requests.
- **Security Headers**: Managed via Flask-Talisman.

---

## 🚀 Running the Server

### 🔵 Starting the Flask Application

Ensure that your virtual environment is activated and all dependencies are installed.

```bash
python app.py
```

By default, the Flask server runs on `http://127.0.0.1:5000/`.

### 🟢 Starting the Celery Worker

In a separate terminal, activate the virtual environment and start the Celery worker.

```bash
python celery_worker.py worker --loglevel=info
```

**Note**: Ensure that Redis is running before starting the Celery worker.

---

## 📡 API Endpoints

The API is organized into three main categories: **User**, **Order**, and **Admin**. Each category has its own set of endpoints to handle various functionalities.

### 🔐 Authentication

All protected endpoints require a valid JWT access token. Include the token in the `Authorization` header as follows:

```
Authorization: Bearer <access_token>
```

---

### 👤 User Endpoints

#### 1. **Login**

- **URL**: `/api/user/login`
- **Method**: `POST`
- **Description**: Authenticates a user using their phone number. If the user does not exist, it registers a new user.

- **Request Body**:

  ```json
  {
    "phone_number": "01012345678"
  }
  ```

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "message": "تم تسجيل الدخول بنجاح",
      "data": {
        "access_token": "<jwt_token>",
        "user": {
          "id": 1,
          "phone_number": "01012345678",
          "whatsapp_number": null,
          "creation_date": "2024-11-23T02:50:35.367139",
          "is_admin": false,
          "is_blocked": false,
          "orders": [],
          "free_place_data_url": "https://example.com/api/free_place_data.json"
        }
      }
    }
    ```

  - **400 Bad Request**

    ```json
    {
      "code": 400,
      "message": "رقم الهاتف مطلوب"
    }
    ```

  - **403 Forbidden**

    ```json
    {
      "code": 403,
      "message": "حسابك محظور"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

#### 2. **Profile**

- **URL**: `/api/user/profile`
- **Method**: `GET`
- **Description**: Retrieves the profile information of the authenticated user.

- **Headers**:

  ```
  Authorization: Bearer <access_token>
  ```

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "data": {
        "id": 1,
        "phone_number": "01012345678",
        "whatsapp_number": "01087654321",
        "creation_date": "2024-11-23T02:50:35.367139",
        "is_admin": false,
        "is_blocked": false,
        "orders": []
      }
    }
    ```

  - **404 Not Found**

    ```json
    {
      "code": 404,
      "message": "المستخدم غير موجود"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

---

### 📦 Order Endpoints

#### 1. **Place Order**

- **URL**: `/api/order/place`
- **Method**: `POST`
- **Description**: Allows authenticated users to place a new order.

- **Headers**:

  ```
  Authorization: Bearer <access_token>
  ```

- **Request Body**:

  ```json
  {
    "place_name": "Cairo Office",
    "business_details": "Details about the business.",
    "selected_govs": ["Cairo", "Giza"],
    "whatsapp_number": "01087654321"
  }
  ```

  **Parameters**:

  - `place_name` (string, required): Name of the place.
  - `business_details` (string, optional): Additional details about the business.
  - `selected_govs` (array of strings, required): List of selected governorates. Can include "كل محافظات مصر" for all governorates.
  - `whatsapp_number` (string, optional): User's WhatsApp number for notifications.

- **Responses**:

  - **201 Created**

    ```json
    {
      "code": 201,
      "message": "تم تقديم الطلب بنجاح",
      "data": {
        "order_id": 123
      }
    }
    ```

  - **400 Bad Request**

    ```json
    {
      "code": 400,
      "message": "يرجى إدخال جميع الحقول المطلوبة"
    }
    ```

    Or for invalid governorates:

    ```json
    {
      "code": 400,
      "message": "المحافظات المحددة غير صالحة"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

#### 2. **Order Status**

- **URL**: `/api/order/status`
- **Method**: `GET`
- **Description**: Retrieves the status of all orders placed by the authenticated user.

- **Headers**:

  ```
  Authorization: Bearer <access_token>
  ```

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "data": [
        {
          "order_id": 123,
          "user_id": 1,
          "place_name": "Cairo Office",
          "business_details": "Details about the business.",
          "selected_govs": ["Cairo", "Giza"],
          "total_price": 5000.0,
          "status": "Processing",
          "json_file_url": "https://example.com/api/orders/123/data.json",
          "order_date": "2024-11-23T03:00:00.000000",
          "queue_position": 1
        },
        // More orders...
      ]
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

---

### 🛡️ Admin Endpoints

**Note**: All admin endpoints require the authenticated user to have `is_admin` set to `true`.

#### 1. **View Orders**

- **URL**: `/api/admin/orders`
- **Method**: `GET`
- **Description**: Retrieves all orders, ordered by their queue position.

- **Headers**:

  ```
  Authorization: Bearer <admin_access_token>
  ```

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "data": [
        {
          "order_id": 123,
          "user_id": 1,
          "place_name": "Cairo Office",
          "business_details": "Details about the business.",
          "selected_govs": ["Cairo", "Giza"],
          "total_price": 5000.0,
          "status": "Processing",
          "json_file_url": "https://example.com/api/orders/123/data.json",
          "order_date": "2024-11-23T03:00:00.000000",
          "queue_position": 1
        },
        // More orders...
      ]
    }
    ```

  - **403 Forbidden**

    ```json
    {
      "code": 403,
      "message": "غير مصرح"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

#### 2. **Accept Order**

- **URL**: `/api/admin/orders/<order_id>/accept`
- **Method**: `POST`
- **Description**: Accepts an order and changes its status to "Processing". Initiates background processing.

- **Headers**:

  ```
  Authorization: Bearer <admin_access_token>
  ```

- **Parameters**:

  - `order_id` (integer, path parameter): ID of the order to accept.

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "message": "تم قبول الطلب وسيتم معالجته قريباً"
    }
    ```

  - **400 Bad Request**

    ```json
    {
      "code": 400,
      "message": "لا يمكن قبول هذا الطلب في الوقت الحالي"
    }
    ```

  - **404 Not Found**

    ```json
    {
      "code": 404,
      "message": "الطلب غير موجود"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

#### 3. **Complete Order**

- **URL**: `/api/admin/orders/<order_id>/complete`
- **Method**: `POST`
- **Description**: Completes an order by updating its status to "Completed" and setting the JSON file URL.

- **Headers**:

  ```
  Authorization: Bearer <admin_access_token>
  ```

- **Parameters**:

  - `order_id` (integer, path parameter): ID of the order to complete.

- **Request Body**:

  ```json
  {
    "json_file_url": "https://example.com/api/orders/123/data.json"
  }
  ```

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "message": "تم إكمال الطلب بنجاح"
    }
    ```

  - **400 Bad Request**

    ```json
    {
      "code": 400,
      "message": "يرجى توفير رابط ملف JSON"
    }
    ```

    Or for invalid status:

    ```json
    {
      "code": 400,
      "message": "لا يمكن إكمال هذا الطلب في الوقت الحالي"
    }
    ```

  - **404 Not Found**

    ```json
    {
      "code": 404,
      "message": "الطلب غير موجود"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

#### 4. **Manage Governorates**

##### a. **Get Governorates**

- **URL**: `/api/admin/governorates`
- **Method**: `GET`
- **Description**: Retrieves a list of all governorates.

- **Headers**:

  ```
  Authorization: Bearer <admin_access_token>
  ```

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "data": [
        {
          "id": 1,
          "name": "Cairo",
          "price": 2000.0
        },
        // More governorates...
      ]
    }
    ```

  - **403 Forbidden**

    ```json
    {
      "code": 403,
      "message": "غير مصرح"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

##### b. **Add Governorate**

- **URL**: `/api/admin/governorates`
- **Method**: `POST`
- **Description**: Adds a new governorate.

- **Headers**:

  ```
  Authorization: Bearer <admin_access_token>
  ```

- **Request Body**:

  ```json
  {
    "name": "Alexandria",
    "price": 1500.0
  }
  ```

- **Responses**:

  - **201 Created**

    ```json
    {
      "code": 201,
      "message": "تم إضافة المحافظة بنجاح"
    }
    ```

  - **400 Bad Request**

    ```json
    {
      "code": 400,
      "message": "يرجى إدخال جميع الحقول المطلوبة"
    }
    ```

    Or if the governorate already exists:

    ```json
    {
      "code": 400,
      "message": "اسم المحافظة موجود مسبقاً"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

##### c. **Edit Governorate**

- **URL**: `/api/admin/governorates/<gov_id>/edit`
- **Method**: `POST`
- **Description**: Edits an existing governorate.

- **Headers**:

  ```
  Authorization: Bearer <admin_access_token>
  ```

- **Parameters**:

  - `gov_id` (integer, path parameter): ID of the governorate to edit.

- **Request Body**:

  ```json
  {
    "name": "New Alexandria",
    "price": 1800.0
  }
  ```

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "message": "تم تعديل المحافظة بنجاح"
    }
    ```

  - **400 Bad Request**

    ```json
    {
      "code": 400,
      "message": "يرجى إدخال جميع الحقول المطلوبة"
    }
    ```

    Or if there's a name conflict:

    ```json
    {
      "code": 400,
      "message": "اسم المحافظة موجود مسبقاً"
    }
    ```

  - **404 Not Found**

    ```json
    {
      "code": 404,
      "message": "المحافظة غير موجودة"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

##### d. **Delete Governorate**

- **URL**: `/api/admin/governorates/<gov_id>/delete`
- **Method**: `POST`
- **Description**: Deletes an existing governorate.

- **Headers**:

  ```
  Authorization: Bearer <admin_access_token>
  ```

- **Parameters**:

  - `gov_id` (integer, path parameter): ID of the governorate to delete.

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "message": "تم حذف المحافظة بنجاح"
    }
    ```

  - **404 Not Found**

    ```json
    {
      "code": 404,
      "message": "المحافظة غير موجودة"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

#### 5. **Block User**

- **URL**: `/api/admin/users/<user_id>/block`
- **Method**: `POST`
- **Description**: Blocks a user from accessing the system.

- **Headers**:

  ```
  Authorization: Bearer <admin_access_token>
  ```

- **Parameters**:

  - `user_id` (integer, path parameter): ID of the user to block.

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "message": "تم حظر المستخدم بنجاح"
    }
    ```

  - **400 Bad Request**

    ```json
    {
      "code": 400,
      "message": "المستخدم محظور بالفعل"
    }
    ```

  - **404 Not Found**

    ```json
    {
      "code": 404,
      "message": "المستخدم غير موجود"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

#### 6. **Unblock User**

- **URL**: `/api/admin/users/<user_id>/unblock`
- **Method**: `POST`
- **Description**: Unblocks a previously blocked user.

- **Headers**:

  ```
  Authorization: Bearer <admin_access_token>
  ```

- **Parameters**:

  - `user_id` (integer, path parameter): ID of the user to unblock.

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "message": "تم إلغاء حظر المستخدم بنجاح"
    }
    ```

  - **400 Bad Request**

    ```json
    {
      "code": 400,
      "message": "المستخدم غير محظور"
    }
    ```

  - **404 Not Found**

    ```json
    {
      "code": 404,
      "message": "المستخدم غير موجود"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

#### 7. **View Users**

- **URL**: `/api/admin/users`
- **Method**: `GET`
- **Description**: Retrieves a list of all users.

- **Headers**:

  ```
  Authorization: Bearer <admin_access_token>
  ```

- **Responses**:

  - **200 OK**

    ```json
    {
      "code": 200,
      "data": [
        {
          "id": 1,
          "phone_number": "01012345678",
          "whatsapp_number": "01087654321",
          "creation_date": "2024-11-23T02:50:35.367139",
          "is_admin": false,
          "is_blocked": false,
          "orders": []
        },
        // More users...
      ]
    }
    ```

  - **403 Forbidden**

    ```json
    {
      "code": 403,
      "message": "غير مصرح"
    }
    ```

  - **500 Internal Server Error**

    ```json
    {
      "code": 500,
      "message": "Internal Server Error"
    }
    ```

---

## 🗃️ Database Models

The application uses SQLAlchemy for ORM (Object-Relational Mapping). Below are the primary models used in the application.

### 1. **User**

Represents a user of the application.

- **Table Name**: `user`

- **Fields**:

  | Field Name        | Type        | Constraints                                               |
  | ----------------- | ----------- | --------------------------------------------------------- |
  | `id`              | Integer     | Primary Key                                               |
  | `phone_number`    | String(20)  | Unique, Not Nullable                                       |
  | `whatsapp_number` | String(20)  | Nullable                                                   |
  | `creation_date`   | DateTime    | Default: Current UTC Time, Not Nullable                   |
  | `is_admin`        | Boolean     | Default: `False`, Not Nullable                             |
  | `is_blocked`      | Boolean     | Default: `False`, Not Nullable                             |
  | `orders`          | Relationship | One-to-Many with `Order` (cascade: all, delete-orphan) |

- **Methods**:

  - `to_dict()`: Returns a dictionary representation of the user.

    ```python
    def to_dict(self):
        return {
            'id': self.id,
            'phone_number': self.phone_number,
            'whatsapp_number': self.whatsapp_number,
            'creation_date': self.creation_date.isoformat(),
            'is_admin': self.is_admin,
            'is_blocked': self.is_blocked,
            "orders": self.orders
        }
    ```

### 2. **Order**

Represents an order placed by a user.

- **Table Name**: `order`

- **Fields**:

  | Field Name        | Type        | Constraints                                               |
  | ----------------- | ----------- | --------------------------------------------------------- |
  | `id`              | Integer     | Primary Key                                               |
  | `user_id`         | Integer     | Foreign Key to `user.id`, Not Nullable, Indexed           |
  | `place_name`      | String(100) | Not Nullable                                               |
  | `business_details`| Text        | Nullable                                                   |
  | `selected_govs`   | Text        | Not Nullable (Comma-separated governorates)               |
  | `total_price`     | Float       | Not Nullable                                               |
  | `status`          | String(50)  | Default: "Awaiting Payment Confirmation", Not Nullable    |
  | `json_file_url`   | String(200) | Nullable                                                   |
  | `order_date`      | DateTime    | Default: Current UTC Time, Not Nullable                   |
  | `queue_position`  | Integer     | Default: 0, Not Nullable, Indexed                         |

- **Methods**:

  - `to_dict()`: Returns a dictionary representation of the order.

    ```python
    def to_dict(self):
        return {
            'order_id': self.id,
            'user_id': self.user_id,
            'place_name': self.place_name,
            'business_details': self.business_details,
            'selected_govs': self.selected_govs.split(','),
            'total_price': self.total_price,
            'status': self.status,
            'json_file_url': self.json_file_url,
            'order_date': self.order_date.isoformat(),
            'queue_position': self.queue_position
        }
    ```

### 3. **Governorate**

Represents a governorate (administrative division).

- **Table Name**: `governorate`

- **Fields**:

  | Field Name | Type       | Constraints                      |
  | ---------- | ---------- | -------------------------------- |
  | `id`       | Integer    | Primary Key                      |
  | `name`     | String(50) | Unique, Not Nullable, Indexed     |
  | `price`    | Float      | Not Nullable                      |

- **Methods**:

  - `to_dict()`: Returns a dictionary representation of the governorate.

    ```python
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price
        }
    ```

---

## 🔄 Background Tasks

**Celery** is used for handling asynchronous background tasks, such as processing orders and sending WhatsApp notifications.

### 1. **Process Order Task**

- **Function**: `process_order_task(order_id)`
- **Description**: Processes an order by generating a JSON file URL, updating the order status, and sending a WhatsApp notification to the user.

- **Workflow**:
  1. **Fetch Order**: Retrieve the order from the database using `order_id`.
  2. **Simulate Processing**: Perform data preparation (e.g., data analysis, report generation). Currently simulated with a delay.
  3. **Generate JSON URL**: Create a URL pointing to the generated JSON file.
  4. **Update Status**: Change the order status to "Completed".
  5. **Commit Changes**: Save the updates to the database.
  6. **Send Notification**: Notify the user via WhatsApp about the order completion.

- **Error Handling**:
  - **Retries**: Retries the task up to 3 times in case of failure with a delay of 60 seconds between attempts.
  - **Failure Handling**: If all retries fail, updates the order status to "Failed" and notifies the user about the failure.

- **Code Snippet**:

  ```python
  @celery.task(bind=True, max_retries=3, default_retry_delay=60)
  def process_order_task(self, order_id):
      try:
          with celery.flask_app.app_context():
              order = Order.query.get(order_id)
              if not order:
                  logger.error(f"Order not found: order_id={order_id}")
                  return

              logger.info(f"Processing order_id={order_id}")

              # Simulate data preparation
              time.sleep(5)  # Replace with actual processing logic

              # Generate JSON file URL
              order.json_file_url = f"https://example.com/api/orders/{order.id}/data.json"

              # Update order status to 'Completed'
              order.status = 'Completed'
              db.session.commit()
              logger.info(f"Order completed: order_id={order_id}")

              # Send WhatsApp notification to the user
              message = f"تم إكمال طلبك رقم {order.id}. يمكنك الآن الوصول إلى البيانات من خلال رابط JSON الخاص بك."
              send_whatsapp_message(order.user.whatsapp_number or order.user.phone_number, message)
              logger.info(f"WhatsApp notification sent to user_id={order.user_id} for order_id={order_id}")

      except Exception as exc:
          logger.error(f"Error processing order_id={order_id}: {exc}")
          try:
              self.retry(exc=exc)
          except self.MaxRetriesExceededError:
              with celery.flask_app.app_context():
                  order = Order.query.get(order_id)
                  if order:
                      order.status = 'Failed'
                      db.session.commit()
                      logger.error(f"Order failed after retries: order_id={order_id}")

                  # Notify user about the failure
                  user = User.query.get(order.user_id)
                  if user:
                      failure_message = f"عذراً، حدث خطأ أثناء معالجة طلبك رقم {order.id}. يرجى المحاولة مرة أخرى لاحقاً."
                      send_whatsapp_message(user.whatsapp_number or user.phone_number, failure_message)
                      logger.info(f"WhatsApp failure notification sent to user_id={user.id} for order_id={order.id}")
  ```

---

## 🛑 Error Handling

Custom error handlers are registered to provide consistent and informative error responses.

### 1. **404 Not Found**

- **Trigger**: When a requested resource is not found.
- **Response**:

  ```json
  {
    "code": 404,
    "message": "Not Found"
  }
  ```

### 2. **500 Internal Server Error**

- **Trigger**: When an unexpected server error occurs.
- **Response**:

  ```json
  {
    "code": 500,
    "message": "Internal Server Error"
  }
  ```

**Logging**: All errors are logged with detailed information to aid in debugging and monitoring.

---

## ⏱️ Rate Limiting

**Flask-Limiter** is implemented to prevent abuse by limiting the number of requests a user can make within a specified timeframe.

### 🛠️ Configuration

- **Default Limits**: `200 per day;50 per hour`
- **Key Function**: Custom key function that uses the user's identity (if authenticated) or the remote IP address.

### 🎯 Features

- **User-Based Limiting**: Authenticated users are limited based on their user ID.
- **IP-Based Limiting**: Unauthenticated requests are limited based on the client's IP address.
- **Whitelisting**: Local requests (e.g., from `127.0.0.1`) are exempt from rate limiting.

### 🔍 Implementation

The rate limiter is initialized in `utils/rate_limiter.py`:

```python
limiter = Limiter(
    key_func=get_user_identifier,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",  # Replace with Redis for production
)
```

**Note**: For production environments, it's recommended to use a persistent storage backend like Redis instead of in-memory storage.

---

## 🔒 Security

Security best practices are implemented to protect the application from common vulnerabilities.

### 1. **JWT Authentication**

- **Library**: Flask-JWT-Extended
- **Usage**: Provides secure token-based authentication.
- **Token Management**: Tokens do not expire for simplicity (`JWT_ACCESS_TOKEN_EXPIRES = False`). Consider enabling expiration for enhanced security.

### 2. **Flask-Talisman**

- **Purpose**: Sets various HTTP security headers to protect against common web vulnerabilities.
- **Configuration**: Managed in `utils/security.py`.

  ```python
  csp = {
      'default-src': [
          "'self'",
          'https://stackpath.bootstrapcdn.com',
          'https://cdnjs.cloudflare.com',
          # Add other trusted sources
      ]
  }
  Talisman(app, content_security_policy=csp)
  ```

### 3. **Rate Limiting**

- Prevents brute-force attacks and API abuse.

### 4. **Input Validation**

- Ensures that all required fields are provided and valid in API requests.

### 5. **Whitelisted IPs**

- Certain IP addresses (e.g., localhost) can be exempted from rate limiting.

---

## 📜 Database Migrations

**Flask-Migrate** and **Alembic** are used to handle database migrations.

### 🛠️ Setup

1. **Initialize Migrations**

   ```bash
   flask db init
   ```

2. **Create a Migration Script**

   ```bash
   flask db migrate -m "Initial migration."
   ```

3. **Apply Migrations**

   ```bash
   flask db upgrade
   ```

### 📂 Migrations Directory

- **env.py**: Configures the migration environment.
- **versions/**: Contains migration scripts with unique revision IDs.

**Example Migration Script** (`migrations/versions/4fdcd22313de_.py`):

```python
def upgrade():
    # Commands to create tables
    op.create_table('governorate', ...)
    op.create_table('user', ...)
    op.create_table('order', ...)
    ...

def downgrade():
    # Commands to drop tables
    op.drop_table('order')
    op.drop_table('user')
    op.drop_table('governorate')
    ...
```

**Note**: Always review and adjust auto-generated migration scripts as needed before applying them.

---

## 📚 Dependencies

All project dependencies are listed in the `requirements.txt` file.

### 📌 Core Dependencies

- **Flask==2.0.1**: Web framework.
- **Flask-JWT-Extended==4.3.1**: JWT authentication.
- **Flask-Limiter==2.1.0**: Rate limiting.
- **Flask-Migrate==3.1.0**: Database migrations.
- **Flask-SQLAlchemy==2.5.1**: ORM.
- **Flask-Cors==3.0.10**: Cross-Origin Resource Sharing.
- **Flask-Talisman==0.8.1**: Security headers.
- **Celery==5.2.3**: Asynchronous task queue.
- **redis==4.1.0**: Redis client for Celery.
- **python-dotenv==0.21.0**: Environment variable management.
- **Werkzeug==2.0.3**: WSGI utility library.
- **SQLAlchemy==1.4.46**: SQL toolkit and ORM.
- **setuptools==59.6.0**, **click==8.1.7**, **click-didyoumean==0.3.1**, **click-plugins==1.1.1**: CLI utilities.

### 📌 Development Dependencies

- **Alembic**: Database migrations (included with Flask-Migrate).

---

## 🔧 Utilities

### 1. **Authentication Decorator**

Located in `utils/auth.py`, the `admin_required` decorator ensures that only admin users can access certain endpoints.

```python
def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or not user.is_admin:
                logger.warning(f"Unauthorized admin access attempt by user_id={user_id}")
                return {'code': 403, 'message': 'غير مصرح'}, 403
        except Exception as e:
            logger.error(f"Error in admin_required decorator: {e}")
            return {'code': 500, 'message': 'Internal Server Error'}, 500
        return fn(*args, **kwargs)
    return wrapper
```

### 2. **Export Data to CSV**

Located in `utils/export_data.py`, the `export_to_csv` function allows exporting data as a CSV file.

```python
def export_to_csv(data):
    if not data:
        logger.info("No data available to export.")
        return Response("No data available to export.", mimetype='text/csv')

    headers = data[0].keys()

    def generate():
        yield ','.join(headers) + '\n'
        for row in data:
            yield ','.join([str(row.get(header, "")) for header in headers]) + '\n'

    response = Response(generate(), mimetype='text/csv')
    response.headers.set("Content-Disposition", "attachment", filename="places_data.csv")
    logger.info("CSV export initiated.")
    return response
```

### 3. **Rate Limiter**

Located in `utils/rate_limiter.py`, handles rate limiting based on user identity or IP address.

```python
limiter = Limiter(
    key_func=get_user_identifier,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",  # Replace with Redis for production
)
```

### 4. **Security Initialization**

Located in `utils/security.py`, initializes security headers using Flask-Talisman.

```python
def init_security(app):
    try:
        csp = {
            'default-src': [
                "'self'",
                'https://stackpath.bootstrapcdn.com',
                'https://cdnjs.cloudflare.com',
                # Add other trusted sources
            ]
        }
        Talisman(app, content_security_policy=csp)
        logger.info("Security headers initialized with Flask-Talisman.")
    except Exception as e:
        logger.error(f"Error initializing security headers: {e}")
```

### 5. **WhatsApp Messaging**

Located in `utils/whatsapp.py`, handles sending WhatsApp messages via Twilio's API.

```python
def send_whatsapp_message(phone_number, message):
    pass
    """
    Send a WhatsApp message using Twilio's WhatsApp API.

    Args:
        phone_number (str): Recipient's phone number in E.164 format (e.g., +2010XXXXXXX).
        message (str): The message to send.

    try:
        account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        whatsapp_from = os.getenv('TWILIO_WHATSAPP_NUMBER')  # e.g., 'whatsapp:+14155238886'

        if not all([account_sid, auth_token, whatsapp_from]):
            logger.error("Twilio credentials are not properly set in environment variables.")
            return

        client = Client(account_sid, auth_token)
        message = client.messages.create(
            body=message,
            from_=whatsapp_from,
            to=f'whatsapp:{phone_number}'
        )
        logger.info(f"WhatsApp message sent to {phone_number}: SID={message.sid}")
    except Exception as e:
        logger.error(f"Failed to send WhatsApp message to {phone_number}: {e}")
    """
```

**Note**: The actual implementation is commented out. To enable WhatsApp messaging, uncomment and configure the Twilio client as shown in the commented section.

---

## 📁 Project Structure

Here's a breakdown of the project's files and directories:

```plaintext
Backend/
├── app.py
├── celery_app.py
├── celery_worker.py
├── config.py
├── extensions.py
├── models.py
├── requirements.txt
├── tasks.py
├── controllers/
│   ├── admin_controller.py
│   ├── order_controller.py
│   └── user_controller.py
├── migrations/
│   ├── env.py
│   └── versions/
│       └── 4fdcd22313de_.py
└── utils/
    ├── auth.py
    ├── export_data.py
    ├── rate_limiter.py
    ├── security.py
    └── whatsapp.py
```

### 📂 Detailed Breakdown

1. **app.py**
   - Initializes the Flask application.
   - Configures extensions (SQLAlchemy, Migrate, JWT, CORS, Limiter, Security).
   - Registers blueprints for user, order, and admin controllers.
   - Defines routes for serving HTML pages and static files.
   - Registers custom error handlers.

2. **celery_app.py & celery_worker.py**
   - Configures and initializes Celery with the Flask application context.
   - `celery_worker.py` serves as the entry point for running Celery workers.

3. **config.py**
   - Manages application configuration, loading from environment variables.

4. **extensions.py**
   - Initializes Flask extensions like SQLAlchemy.

5. **models.py**
   - Defines the database models: User, Order, Governorate.

6. **tasks.py**
   - Contains Celery tasks, such as processing orders asynchronously.

7. **controllers/**
   - **user_controller.py**: Handles user-related endpoints (login, profile).
   - **order_controller.py**: Manages order-related endpoints (place order, order status).
   - **admin_controller.py**: Manages admin-related endpoints (view orders, manage governorates, manage users).

8. **migrations/**
   - Manages database migrations using Alembic.
   - **env.py**: Configures the migration environment.
   - **versions/**: Contains migration scripts with unique revision IDs.

9. **utils/**
   - **auth.py**: Authentication decorators.
   - **export_data.py**: Utility for exporting data to CSV.
   - **rate_limiter.py**: Configures rate limiting.
   - **security.py**: Initializes security headers.
   - **whatsapp.py**: Handles WhatsApp messaging via Twilio.

---

## ✍️ Contributing

We appreciate your interest in contributing! Here's how you can help:

1. **Fork the Repository**

   Click on **Fork** at the top right corner of this page.

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/kariemSeiam/GeoEgy/.git
   ```

3. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**

   Implement your feature or fix.

5. **Commit and Push**

   ```bash
   git commit -m "Add new feature"
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

   Submit your pull request against the **main** branch with a detailed description.

---

## 📄 License

This project is released under the [MIT License](LICENSE).

---

## 📫 Contact

Have questions or suggestions? We'd love to hear from you!

- **Email**: [your.email@example.com](mailto:your.email@example.com)
- **LinkedIn**: [Your Name](https://www.linkedin.com/in/yourprofile/)
- **GitHub**: [yourusername](https://github.com/yourusername)

---

## 🙌 Acknowledgments

A heartfelt thank you to all contributors and the following resources:

- **[Flask](https://flask.palletsprojects.com/)**
- **[Celery](https://docs.celeryproject.org/)**
- **[Twilio](https://www.twilio.com/)**
- **[Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)**
- **[Flask-Limiter](https://flask-limiter.readthedocs.io/)**
- **[Flask-Migrate](https://flask-migrate.readthedocs.io/)**
- **[SQLAlchemy](https://www.sqlalchemy.org/)**
- **[Alembic](https://alembic.sqlalchemy.org/)**
- **Community Contributors**: For their valuable input and support.

---

## 💡 Final Thoughts

The **GeoEgy** backend is a powerful and flexible system designed to handle complex geographical data processing with ease and security. By following this documentation, developers and contributors can effectively set up, understand, and enhance the application's functionality.

---
