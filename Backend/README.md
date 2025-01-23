#  BACKEND Documentation 

## User Endpoints

### User Registration Endpoint Documentation
---
---

##### Endpoint : `/users/register`

##### HTTP Method: POST

##### Description:
This endpoint is used to register a new user. It validates the input data and creates a new user in the database.

##### Request Body:
The request body must be a JSON object containing the following fields:
- `fullname`: An object containing:
  - `firstname`: A string with a minimum length of 3 characters (required)
  - `lastname`: A string with a minimum length of 3 characters (optional)
- `email`: A valid email address (required)
- `password`: A string with a minimum length of 6 characters (required)

##### Example Request Body:
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

##### Responses:

###### Success (201 Created):
- **Description**: User successfully registered.
- **Body**:
  ```json
  {
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```

###### Client Error (400 Bad Request):
- **Description**: Invalid input data.
- **Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Error message",
        "param": "field_name",
        "location": "body"
      }
    ]
  }
  ```

##### Notes:
- Ensure that the `Content-Type` header is set to `application/json` when making requests to this endpoint.

### User Login Endpoint Documentation
---
---


#### Endpoint : `/users/login`

#### HTTP Method: POST

#### Description:
This endpoint is used to log in an existing user. It validates the input data and checks the user's credentials.

#### Request Body:
The request body must be a JSON object containing the following fields:
- `email`: A valid email address (required)
- `password`: A string with a minimum length of 6 characters (required)

#### Example Request Body:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Responses:

#### Success (200 OK):
- **Description**: User successfully logged in.
- **Body**:
  ```json
  {
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
    }
  }
  ```

#### Client Error (400 Bad Request):
- **Description**: Invalid input data.
- **Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Error message",
        "param": "field_name",
        "location": "body"
      }
    ]
  }
  ```

#### Client Error (401 Unauthorized):
- **Description**: Invalid email or password.
- **Body**:
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

#### Notes:
- Ensure that the `Content-Type` header is set to `application/json` when making requests to this endpoint.

### User Profile Endpoint Documentation
---
---

#### Endpoint : `/users/profile`

#### HTTP Method: GET

#### Description:
This endpoint is used to get the profile of the logged-in user.

#### Responses:

#### Success (200 OK):
- **Description**: User profile retrieved successfully.
- **Body**:
  ```json
  {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
  ```

#### Client Error (401 Unauthorized):
- **Description**: Unauthorized access.
- **Body**:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

#### Notes:
- Ensure that the `Authorization` header is set to `Bearer <token>` when making requests to this endpoint.

### User Logout Endpoint Documentation
---
---

#### Endpoint : `/users/logout`

#### HTTP Method: GET

#### Description:
This endpoint is used to log out the currently logged-in user.

#### Responses:

#### Success (200 OK):
- **Description**: User successfully logged out and blacklist token provided in cookie or header.
- **Body**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Client Error (401 Unauthorized):
- **Description**: Unauthorized access.
- **Body**:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

#### Notes:
- Ensure that the `Authorization` header is set to `Bearer <token>` when making requests to this endpoint or in cookie.

## Captain Endpoints

### Captain Registration Endpoint Documentation
---
---

### Endpoint : `/captains/register`

### HTTP Method: POST

### Description:
This endpoint is used to register a new captain. It validates the input data and creates a new captain in the database.

### Request Body:
The request body must be a JSON object containing the following fields:
- `fullname`: An object containing:
  - `firstname`: A string with a minimum length of 3 characters (required)
  - `lastname`: A string with a minimum length of 3 characters (optional)
- `email`: A valid email address (required)
- `password`: A string with a minimum length of 6 characters (required)
- `vehicle`: An object containing:
  - `color`: A string with a minimum length of 3 characters (required)
  - `plate`: A string with a minimum length of 3 characters (required)
  - `capacity`: An integer with a minimum value of 1 (required)
  - `vehicleType`: A string that must be one of the following values: `car`, `motorcycle`, `bus`, `auto` (required)

### Example Request Body:
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "XYZ123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Responses:

#### Success (201 Created):
- **Description**: Captain successfully registered.
- **Body**:
  ```json
  {
    "token": "jwt_token",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "XYZ123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```

#### Client Error (400 Bad Request):
- **Description**: Invalid input data.
- **Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Error message",
        "param": "field_name",
        "location": "body"
      }
    ]
  }
  ```

### Notes:
- Ensure that the `Content-Type` header is set to `application/json` when making requests to this endpoint.

### Captain Login Endpoint Documentation
---
---


### Endpoint : `/captains/login`

### HTTP Method: POST

### Description:
This endpoint is used to log in an existing captain. It validates the input data and checks the captain's credentials.

### Request Body:
The request body must be a JSON object containing the following fields:
- `email`: A valid email address (required)
- `password`: A string with a minimum length of 6 characters (required)

### Example Request Body:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Responses:

#### Success (200 OK):
- **Description**: Captain successfully logged in.
- **Body**:
  ```json
  {
    "token": "jwt_token",
    "captain": {
      "_id": "captain_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "XYZ123",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
  ```

#### Client Error (400 Bad Request):
- **Description**: Invalid input data.
- **Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Error message",
        "param": "field_name",
        "location": "body"
      }
    ]
  }
  ```

#### Client Error (401 Unauthorized):
- **Description**: Invalid email or password.
- **Body**:
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### Notes:
- Ensure that the `Content-Type` header is set to `application/json` when making requests to this endpoint.

### Get Captain Profile Endpoint Documentation
---
---

### Endpoint : `/captains/profile`

### HTTP Method: GET

### Description:
This endpoint is used to get the profile of the logged-in captain.

### Responses:

#### Success (200 OK):
- **Description**: Captain profile retrieved successfully.
- **Body**:
  ```json
  {
    "_id": "captain_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
  ```

#### Client Error (401 Unauthorized):
- **Description**: Unauthorized access.
- **Body**:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Notes:
- Ensure that the `Authorization` header is set to `Bearer <token>` when making requests to this endpoint.

### Captain Logout Endpoint Documentation
---
---

### Endpoint : `/captains/logout`

### HTTP Method: GET

### Description:
This endpoint is used to log out the currently logged-in captain.

### Responses:

#### Success (200 OK):
- **Description**: Captain successfully logged out and blacklist token provided in cookie or header.
- **Body**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Client Error (401 Unauthorized):
- **Description**: Unauthorized access.
- **Body**:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Notes:
- Ensure that the `Authorization` header is set to `Bearer <token>` when making requests to this endpoint or in cookie.

### Update Captain Location Endpoint Documentation

### Endpoint : `/captains/location`

### HTTP Method: PUT

### Description:
This endpoint is used to update the location of the logged-in captain.

### Request Body:
The request body must be a JSON object containing the following fields:
- `latitude`: A number representing the latitude (required)
- `longitude`: A number representing the longitude (required)

### Example Request Body:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

### Responses:

#### Success (200 OK):
- **Description**: Captain location updated successfully.
- **Body**:
  ```json
  {
    "_id": "captain_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194
    }
  }
  ```

#### Client Error (400 Bad Request):
- **Description**: Invalid input data.
- **Body**:
  ```json
  {
    "errors": [
      {
        "msg": "Error message",
        "param": "field_name",
        "location": "body"
      }
    ]
  }
  ```

#### Client Error (401 Unauthorized):
- **Description**: Unauthorized access.
- **Body**:
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Notes:
- Ensure that the `Content-Type` header is set to `application/json` when making requests to this endpoint.
- Ensure that the `Authorization` header is set to `Bearer <token>` when making requests to this endpoint.
