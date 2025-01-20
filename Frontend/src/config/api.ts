export const API_CONFIG = {
  BASE_URL:  'http://localhost:3000',
  ENDPOINTS: {
    USERS: '/users',
    USER_ACTIVITIES: '/users/:userId',
    USER_PDF: '/pdf/user/:userId',
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}; 