export const RESEND_OTP_TIME = 30;

export const APP_CONFIG = {
  API_TIMEOUT_MS: 10_000,
  TOAST_AUTO_CLOSE_MS: 3_000,
  TOAST_LIMIT: 3,
  OTP_LENGTH: 6,
  OTP_TICK_INTERVAL_MS: 1_000,
  PASSWORD_MIN_LENGTH: 7,
  OTP_DIGIT_LENGTH: 1,
  SECONDS_PER_MINUTE: 60,
  DEFAULT_ATTRIBUTE_SET_ID: 1,
  PAGE_SIZE: 5,
  PAGE_RANGE_AFTER_CURRENT: 2,
  PAGE_RANGE_BEFORE_CURRENT: 1,
  FIRST_PAGE: 1,
  INITIAL_TOTAL_ITEMS: 1,
  INITIAL_TOTAL_PAGES: 1,
  INITIAL_PAGE_SIZE: 10,
  DATE_FORMAT: 'DD-MM-YYYY',
} as const;

export const TOAST_CONFIG = {
  POSITION: 'top-right',
  THEME: 'light',
} as const;

export const OTP_VALIDATION_PATTERN = new RegExp(`^\\d{${APP_CONFIG.OTP_LENGTH}}$`);

export const getViewCategoryEndpoint = (id: number) => `/attribute/view-attribute/${id}`;
export const getUpdateCategoryEndpoint = (id: number) => `/attribute/update-attribute/${id}`;
export const getDeleteCategoryEndpoint = (id: number) => `/attribute/delete-attribute/${id}`;
export const getDeleteVariantEndpoint = (product_id: number, variant_id: number) =>
  `/product/delete-variant/${product_id}/${variant_id}`;
export const getViewProductEndpoint = (id: number) => `/product/view-product/${id}`;
export const getUpdateProductStatusEndpoint = (id: number) =>
  `/product/update-product-status/${id}`;
export const getUpdateProductEndpoint = (id: number) => `/product/update-product/${id}`;

export const API_ENDPOINTS = {
  LOGIN: '/auth-user/login',
  VERIFY_EMAIL: '/auth-user/verifyEmail',
  FORGOT_PASSWORD: '/auth-user/forgotPassword',
  VIEW_PROFILE: '/auth-user/viewProfile',
  LIST_CATEGORIES: '/attribute/list-Of-attributes',
  VIEW_CATEGORY: getViewCategoryEndpoint,
  ADD_CATEGORY: '/attribute/add-attribute',
  UPDATE_CATEGORY: getUpdateCategoryEndpoint,
  DELETE_CATEGORY: getDeleteCategoryEndpoint,
  LIST_PRODUCTS: '/product/list-Of-products',
  LIST_ATTRIBUTES: '/attribute/list-of-attribute-set',
  VIEW_PRODUCT: getViewProductEndpoint,
  UPDATE_PRODUCT_STATUS: getUpdateProductStatusEndpoint,
  UPLOAD_FILE: '/common/fileUpload',
  UPLOADED_FILE_BASE_PATH: '/public/uploads/',
  ADD_PRODUCT: '/product/add-product',
  UPDATE_PRODUCT: getUpdateProductEndpoint,
  DELETE_VARIANT: getDeleteVariantEndpoint,
} as const;

export const getCategoryEditRoute = (id: string | number) => `/category/edit/${id}`;
export const getProductViewRoute = (id: string | number) => `/product/view/${id}`;
export const getProductEditRoute = (id: string | number) => `/product/edit/${id}`;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  CATEGORY: '/category',
  CATEGORY_ADD: '/category/add',
  CATEGORY_EDIT_PATTERN: '/category/edit/:id',
  CATEGORY_EDIT: getCategoryEditRoute,
  PRODUCT: '/product',
  PRODUCT_ADD: '/product/add',
  PRODUCT_VIEW_PATTERN: '/product/view/:id',
  PRODUCT_VIEW: getProductViewRoute,
  PRODUCT_EDIT_PATTERN: '/product/edit/:id',
  PRODUCT_EDIT: getProductEditRoute,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
} as const;

export const ASSET_URLS = {
  DEFAULT_USER_AVATAR: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg',
} as const;

export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  AUTHORIZATION: 'Authorization',
  JSON: 'application/json',
  MULTIPART_FORM_DATA: 'multipart/form-data',
} as const;

export const FORM_DATA_KEYS = {
  FILES: 'files',
} as const;

export const PRODUCT_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const LIST_QUERY_DEFAULTS = {
  SEARCH: '',
  SORT_KEY: 'createdAt',
  SORT_ASCENDING: 'desc',
} as const;

export const FORM_DEFAULTS = {
  EMPTY_STRING: '',
  ZERO: 0,
} as const;

export const AUTH_ROLES = {
  ADMIN: 'Admin',
} as const;

export const API_ERROR_CODES = {
  REQUEST_TIMEOUT: 'ECONNABORTED',
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_INVALID: 'Please enter correct email.',
  EMAIL_REQUIRED: 'Please enter your email.',
  PASSWORD_MIN_LENGTH: 'Password must be minimum 7 character long.',
  PASSWORD_REQUIRED: 'Please enter your password.',
  OTP_REQUIRED: 'Please enter the 6-digit OTP.',
  NEW_PASSWORD_REQUIRED: 'Please enter new password.',
  CONFIRM_PASSWORD_REQUIRED: 'Please enter new password again.',
  PASSWORDS_MUST_MATCH: 'Passwords must match',
  CATEGORY_NAME_REQUIRED: 'Please enter category name',
  PRODUCT_TITLE_REQUIRED: 'Please enter title',
  PRODUCT_DESCRIPTION_REQUIRED: 'Please enter description',
  PRODUCT_IMAGE_REQUIRED: 'Please upload image',
  ATTRIBUTE_REQUIRED: 'Please Select Attribute',
  INVALID_REQUEST_AT_LOAD: 'Invalid Request! Navigating Back To Home',
} as const;

export const API_ERROR_MESSAGES = {
  REQUEST_FAILED: 'Request failed.',
  SESSION_EXPIRED: 'Session expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to do this.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  REQUEST_TIMED_OUT: 'Request timed out. Try again.',
  CONNECTION_FAILED: 'Unable to connect to the server. Check your connection.',
  UNEXPECTED: 'An unexpected error occurred.',
  NO_TOKEN: 'No token found',
  UNEXPECTED_LOGIN_RESPONSE: 'Unexpected login response.',
} as const;

export const AUTH_ERROR_MESSAGES = {
  LOGIN_FAILED: 'Login Failed! Try Again',
  FORGOT_PASSWORD_FAILED: 'Forgot Password Failed! Try Again',
  CHANGE_PASSWORD_FAILED: 'Change Password Failed! Try Again',
} as const;

export const AUTH_STATE_ERROR_MESSAGES = {
  LOGIN_FAILED: 'Login failed.',
  FORGOT_PASSWORD_FAILED: 'Forgot Password failed.',
  CHANGE_PASSWORD_FAILED: 'Change Password failed.',
} as const;

export const CATEGORY_STATE_ERROR_MESSAGES = {
  FETCH_FAILED: 'Fetching Category Data Failed.',
  SELECT_FAILED: 'Selecting Category Operation Failed.',
  ADD_FAILED: 'Adding Category Operation Failed.',
  EDIT_FAILED: 'Editing Category Operation Failed.',
  DELETE_FAILED: 'Deleting Category Operation Failed.',
} as const;

export const PRODUCT_STATE_ERROR_MESSAGES = {
  FETCH_FAILED: 'Fetching Product Data Failed.',
  FETCH_ATTRIBUTES_FAILED: 'Fetching Attributes Data Failed.',
  FETCH_SINGLE_FAILED: 'Fetching Single Product Data Failed.',
  UPLOAD_FAILED: 'File Upload Failed.',
  UPDATE_FAILED: 'Updating Product Operation Failed.',
  CHANGE_STATUS_FAILED: 'Changing Product Status Failed.',
  ADD_FAILED: 'Adding Product Operation Failed.',
  DELETE_FAILED: 'Deleting Product Operation Failed.',
} as const;

export const ATTRIBUTE_VALIDATION_MESSAGES = {
  TITLE_REQUIRED: 'Please enter title',
  AVAILABLE_QUANTITY_REQUIRED: 'Please enter available quantity',
  ON_HAND_QUANTITY_REQUIRED: 'Please enter on hand quantity',
  CODE_REQUIRED: 'Please enter code',
  FAKE_PRICE_REQUIRED: 'Please enter fake price',
  PRICE_REQUIRED: 'Please enter price',
  IMAGE_STRING_REQUIRED: 'Please Store Valid Image',
} as const;

export const UI_TEXT = {
  COMMON: {
    LOADING: 'Loading...',
    SIGN_OUT: 'Sign out',
    BACK_TO_SIGN_IN: 'Back To Sign In?',
    PREVIOUS: 'Previous',
    NEXT: 'Next',
    SHOWING: 'Showing',
    OF: 'of',
    ACTION: 'Action',
    DELETE: 'Delete',
    EDIT: 'Edit',
    CREATED_ON: 'Created On',
    PAGE_NOT_FOUND: 'Page Not Found',
    BACK_TO_HOME: 'Back To Home',
    ADMIN_SHOP: 'AdminShop',
    PREVIEW_IMAGE_ALT: 'preview-img',
    USER_PHOTO_ALT: 'user photo',
    UPLOADED_PRODUCT_PREVIEW_ALT: 'Uploaded product preview',
    NO_IMAGE: 'No Image',
    TABLE_NAVIGATION: 'Table navigation',
    REQUIRED_MARKER: '*',
    RANGE_SEPARATOR: '-',
    TIMER_SEPARATOR: ':',
    BACK_ARROW: '←',
    OPEN_SIDEBAR: 'Open sidebar',
    OPEN_USER_MENU: 'Open user menu',
    SIDEBAR: 'Sidebar',
    HOME_GREETING: 'Hello HomePage',
    SHOW_PASSWORD: 'Show password',
    HIDE_PASSWORD: 'Hide password',
    OTP_DIGIT_LABEL_PREFIX: 'OTP digit',
  },
  APP_INFO: {
    ADMIN: 'Admin',
    COMMERCE: 'Commerce',
    DESCRIPTION:
      'The all-in-one dashboard to manage your e-commerce business with ease and confidence.',
    ANALYTICS_TITLE: 'Real-time Analytics',
    ANALYTICS_DESCRIPTION: 'Track sales & revenue live',
    INVENTORY_TITLE: 'Inventory Control',
    INVENTORY_DESCRIPTION: 'Smart stock management',
    CUSTOMER_INSIGHTS_TITLE: 'Customer Insights',
    CUSTOMER_INSIGHTS_DESCRIPTION: 'Understand your audience',
  },
  AUTH: {
    EMAIL: 'Email',
    PASSWORD: 'Password',
    SIGN_IN: 'Sign In',
    FORGOT_PASSWORD: 'Forgot Password',
    FORGOT_PASSWORD_LINK: 'Forgot Password?',
    ENTER_EMAIL: 'Enter email',
    ENTER_PASSWORD: 'Enter your password',
    ENTER_NEW_PASSWORD: 'Enter your new password',
    ENTER_NEW_PASSWORD_AGAIN: 'Enter your new password again',
    AUTH_DASHBOARD_DESCRIPTION: 'Access your admin dashboard to manage users.',
    RESET_PASSWORD_DESCRIPTION: 'Enter your email to reset your password',
    OTP_STEP: 'Step 2 of 2 - Verify & Reset',
    EMAIL_STEP: 'Step 1 of 2 - Email',
    OTP_INSTRUCTION_PREFIX: 'Enter the OTP sent on',
    OTP_INSTRUCTION_SUFFIX: 'and set your new password.',
    OTP: 'OTP',
    NEW_PASSWORD: 'New Password',
    CONFIRM_NEW_PASSWORD: 'Confirm New Password',
    RESEND_OTP: 'Resend OTP',
    OTP_RESENT: 'A new OTP has been sent.',
    RESEND_OTP_PROMPT: "Didn't you get the code? Resend in",
    UPDATE_PASSWORD: 'Update Password',
    SEND_OTP: 'Send OTP',
  },
  CATEGORY: {
    NAME: 'Name',
    NAME_PLACEHOLDER: 'Ex. Volt',
    ADD_FORM_TITLE: 'Add New Category Form',
    ADD: 'Add New Category',
    EDIT_FORM_TITLE: 'Edit Category Form',
    EDIT: 'Edit Category',
    VIEW_ALL: 'View All Category',
    ID: 'Category Id',
    TABLE_NAME: 'Category Name',
    DELETE: 'Delete',
    FETCH_FAILED: 'Fetching Category Data Failed',
    DELETE_FAILED: 'Deleting Category Operation Failed',
    ADD_FAILED: 'Adding Category Operation Failed',
    ADDED: 'Category Added',
    DELETED: 'Category Deleted',
    UPDATED: 'Category Updated',
    UPDATE_FAILED: 'Updating Category Operation Failed',
    CATEGORIES: 'Categories',
  },
  PRODUCT: {
    VIEW_ALL: 'View All Products',
    ADD: 'Add New Product',
    ADD_TITLE: 'Add Product',
    EDIT_TITLE: 'Edit Product',
    ID: 'Product Id',
    IMAGE: 'Product Image',
    TITLE: 'Product Title',
    STATUS: 'Product Status',
    ATTRIBUTE_SET: 'Attribute Set',
    ATTRIBUTE_SET_NAME: 'Attribute Set Name',
    DESCRIPTION: 'Description',
    META_TITLE: 'Meta Title',
    META_KEY: 'Meta Key',
    META_DESCRIPTION: 'Meta Description',
    UPLOAD_IMAGE: 'Upload Product Image',
    CLICK_TO_UPLOAD: 'Click to upload',
    ALLOWED_IMAGE_TYPES: 'SVG, PNG, JPG',
    UPLOADING_IMAGE: 'Uploading image...',
    IMAGE_PREVIEW: 'Image preview will appear here',
    UPLOAD_FAILED: 'File Upload Failed',
    UPLOAD_SUCCEEDED_NO_IMAGE: 'Upload succeeded but the server did not return a usable image.',
    UPLOAD_SUCCESS: 'File Upload Success',
    FETCH_PRODUCTS_FAILED: 'Fetching Product Data Failed',
    FETCH_CATEGORIES_FAILED: 'Fetching Category Data Failed',
    FETCH_SINGLE_FAILED: 'Fetching Single Category Data Failed',
    FETCH_ATTRIBUTES_FAILED: 'Fetching Attributed Failed!',
    STATUS_CHANGE_FAILED: 'Changing Product Status Failed',
    CHANGE_STATUS: 'Change Status',
    VIEW: 'View',
    EDIT: 'Edit',
    VIEW_TITLE: 'View Product',
    BACK_TO_LISTING: 'Back To Listing',
    DETAILS: 'Product Details',
    TITLE_LABEL: 'Title :',
    ATTRIBUTE: 'Attribute :',
    DESCRIPTION_LABEL: 'Description :',
    STATUS_LABEL: 'Status :',
    CREATED_ON_LABEL: 'Created On :',
    VARIANT_DETAILS: 'Variant Details',
    VARIANT_TITLE: 'Variant Title',
    VARIANT_CODE: 'Variant Code',
    VARIANT_QUANTITY: 'Variant Quantity',
    VARIANT_PRICE: 'Variant Price',
    VARIANT_STATUS: 'Variant Status',
    PRODUCTS: 'Products',
  },
  VARIANT: {
    TITLE: 'Title',
    TITLE_PLACEHOLDER: 'Enter Variant Title',
    CODE_SKU: 'Code/SKU',
    CODE_PLACEHOLDER: 'Enter Code',
    AVAILABLE_QUANTITY: 'Available Quantity',
    AVAILABLE_QUANTITY_PLACEHOLDER: 'Enter Available Quantity',
    ON_HAND_QUANTITY: 'On Hand Quantity',
    ON_HAND_QUANTITY_PLACEHOLDER: 'Enter On Hand Quantity',
    FAKE_PRICE: 'Fake Price',
    FAKE_PRICE_PLACEHOLDER: 'Enter Fake Price',
    PRICE: 'Price',
    PRICE_PLACEHOLDER: 'Enter Price',
    IMAGE_PLACEHOLDER: 'Add Variant Images',
    ADD: 'Add Variant',
    EDIT: 'Edit Variant',
    FALLBACK_EDIT_ERROR: 'Edit Variant Failed',
  },
  PRODUCT_FORM: {
    TITLE: 'Title',
    TITLE_PLACEHOLDER: 'Enter Product Title',
    META_TITLE_PLACEHOLDER: 'Enter Product Meta Title',
    META_KEY_PLACEHOLDER: 'Enter Product Meta Key',
    META_DESCRIPTION_PLACEHOLDER: 'Enter Product Meta Description',
    DESCRIPTION_PLACEHOLDER: 'Enter Product Description',
    NEXT: 'Check And Next',
    BASE_INFO: 'Base Product Info',
    VARIANT_INFO: 'Variant Info',
    ADD_PRODUCT: 'Add Product',
    EDIT_PRODUCT: 'Edit Product',
  },
} as const;
