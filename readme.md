# Blog Application: Demo-App


## User Credentials
- **Admin User**
  - **Email**: admin@mail.com
  - **Password**: 12345678

- **Dummy Non-Admin**
  - **Email**: test@mail.com
  - **Password**: 12345678

# Features

### USER RESOURCES
- **User Registration**: Register a new user.
- **User Authentication**: Authenticate a user and generate a token.
- **Set User as Admin**: Assign admin rights to a user (Admin only).
- **Retrieve User Details**: Get details of a specific user.
- **Update Password**: Change the password of a user.

## BLOG RESOURCES 

### BLOG OPERATIONS
- **Create Blog**: Add a new blog post (Authenticated users only).
- **Get All Blogs**: Retrieve a list of all blog posts.
- **Get Blog by ID**: Get details of a specific blog post by its ID.
- **Update Blog**: Modify details of an existing blog post (Authenticated users only).
- **Delete Blog**: Remove a blog post by its ID (Authenticated users only and Admin).

### COMMENT OPERATIONS
- **Add Comment**: Add a comment to a specific blog post (Authenticated users only).
- **Get Comments by Blog ID**: Retrieve all comments for a specific blog post.
- **Delete Comment**: Remove a comment by its ID (User can delete only their own comments; Admins can delete any comment).
