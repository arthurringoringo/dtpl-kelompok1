const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:8081"
  : "https://api.desamanudjaya.com";

type ApiError = {
  error?: string;
  message?: string;
};

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const err = data as ApiError | null;
    throw new Error(
      err?.error ||
        err?.message ||
        `Request failed with status ${response.status}`,
    );
  }

  return data as T;
}

/* =========================
   TYPES
========================= */

export type RegisterResponse = {
  id: number;
  email: string;
  full_name: string;
  role: string;
  phone_number: string | null;
};

export type LoginResponse = {
  id?: number;
  email?: string;
  full_name?: string;
  role?: string;
  phone_number?: string | null;
  message?: string;
};

export type LogoutResponse = {
  message: string;
};

export type UserResponse = {
  id: number;
  email: string;
  full_name?: string;
  name?: string;
  role?: string;
  phone_number?: string | null;
  phone?: string | null;
  password?: string;
};

export type Category = {
  id: number;
  name: string;
  image_url: string | null;
};

export type Destination = {
  id: number;
  name: string;
  image_url: string | null;
  date: string;
  start_time: string;
  end_time: string;
  price: string;
  category_id: number;
  category_name: string;
};

export type DestinationDetail = {
  id: number;
  name: string;
  date: string;
  descriptions: string;
  destination_type?: string;
  image_url?: string | null;
  start_time?: string;
  end_time?: string;
  latitude?: string;
  longitude?: string;
  price?: string;
  ticket_type?: string;
  category_id?: number;
  category_name?: string;
  category?: { id: number; name: string; image_url: string | null };
  address?: string;
  reviews?: ReviewData[];
  average_rating?: number | string | null;
  ai_review_summary?: {
    generated_at: string;
    reviews_count: number;
    summary: string;
  } | null;
};

export type DestinationAddOn = {
  id: number;
  name: string;
  price: string; // "25000.00"
};

export type ReviewData = {
  id: number;
  destination_id?: number;
  user_id?: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

/* =========================
   AUTH API
========================= */
export async function updateProfile(payload?: {
  full_name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
}) {
  return apiFetch<UserResponse>("/me", {
    method: "PATCH",
    body: JSON.stringify({
      data: payload || {},
    }),
  });
}
// REGISTER
export async function registerUser(payload: {
  full_name: string;
  email: string;
  password: string;
}) {
  return apiFetch<RegisterResponse>("/register", {
    method: "POST",
    body: JSON.stringify({
      data: payload,
    }),
  });
}

// LOGIN
export async function loginUser(payload: { email: string; password: string }) {
  return apiFetch<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({
      data: payload,
    }),
  });
}

// LOGOUT
export async function logoutUser() {
  return apiFetch<LogoutResponse>("/logout", {
    method: "POST",
  });
}

// GET ALL USERS
export async function getUsers() {
  return apiFetch<UserResponse[]>("/users", {
    method: "GET",
  });
}

// GET CURRENT USER
export async function getMe() {
  return apiFetch<UserResponse>("/me");
}

/* =========================
   CATEGORY API
========================= */

// GET ALL CATEGORIES
export async function getCategories() {
  return apiFetch<Category[]>("/categories");
}

// CREATE CATEGORY
export async function createCategory(payload: {
  name: string;
  image_url: string;
}) {
  return apiFetch<Category>("/category", {
    method: "POST",
    body: JSON.stringify({
      data: payload,
    }),
  });
}

// UPDATE CATEGORY
export async function updateCategory(
  id: string | number,
  payload: { name: string },
) {
  return apiFetch<Category[] | Category>(`/category/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: payload,
    }),
  });
}

// DELETE CATEGORY
export async function deleteCategory(id: string | number) {
  return apiFetch<Category[] | Category>(`/category/${id}`, {
    method: "DELETE",
  });
}

/* =========================
   DESTINATION API
========================= */

// GET ALL DESTINATIONS
export async function getDestinations(params?: {
  day?: "today" | "tomorrow" | "this_week";
  price?: "free";
  category_id?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.day) searchParams.set("day", params.day);
  if (params?.price) searchParams.set("price", params.price);
  if (params?.category_id)
    searchParams.set("category_id", String(params.category_id));

  const query = searchParams.toString();

  return apiFetch<Destination[]>(`/destinations${query ? `?${query}` : ""}`);
}

// GET DESTINATION DETAIL BY ID
export async function getDestinationById(id: string | number) {
  return apiFetch<DestinationDetail>(`/destination/${id}`);
}

// GET DESTINATION ADD-ONS
export async function getDestinationAddOns(destinationId: number | string) {
  return apiFetch<DestinationAddOn[]>(`/destination/${destinationId}/add_ons`);
}

/* =========================
   ACCOMMODATION API
========================= */

export type Accommodation = {
  id: number;
  name: string;
  facilities: string[];
  price: string;
  image_url: string | null;
};

export async function getAccommodations() {
  return apiFetch<Accommodation[]>("/accommodations");
}

export async function getAccommodationById(id: string | number) {
  return apiFetch<Accommodation>(`/accommodation/${id}`);
}

export async function createAccommodation(payload: { name: string; price: number; facilities: string[]; image_url: string }) {
  return apiFetch<Accommodation>("/accommodation", {
    method: "POST",
    body: JSON.stringify({ data: payload }),
  });
}

export async function updateAccommodation(id: string | number, payload: Partial<{ name: string; price: number; facilities: string[]; image_url: string }>) {
  return apiFetch<Accommodation>(`/accommodation/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ data: payload }),
  });
}

export async function deleteAccommodation(id: string | number) {
  return apiFetch<{ message: string }>(`/accommodation/${id}`, {
    method: "DELETE",
  });
}

/* =========================
   ORDER API
========================= */

export type OrderVisitorDetail = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
};

export type OrderResponse = {
  id: number;
  booking_code?: string;
  user_id: number;
  user_name: string;
  qty: number;
  order_total: string;
  tax: string;
  sub_total: string;
  status: string;
  payment_qr_url?: string | null;
  ticket_qr_url?: string | null;
  order_item: {
    id: number;
    name: string;
    image_url: string | null;
    date: string;
    start_time: string;
    end_time: string;
    price: string;
    category_id: number;
    category_name: string;
  };
  order_visitor_details: OrderVisitorDetail[];
  order_add_ons?: { id: number; name: string; price: string }[];
  can_review?: boolean;
  review?: ReviewData | null;
};

export type CheckPaymentStatusResponse = {
  id: number;
  booking_code: string;
  status: string;
  qr_url?: string | null;
  ticket_url?: string | null;
};

export type PaymentPageDetails = {
  id?: number;
  booking_code: string;
  status: string;
  item_name: string;
  item_type: string;
  qty: number;
  sub_total: string;
  tax: string;
  total_amount: string;
  payment_qr_url?: string | null;
};

// CREATE ORDER
export async function createOrder(payload: {
  ticket_id: number;
  ticket_type: string;
  qty: number;
  add_on_ids?: number[];
}) {
  return apiFetch<OrderResponse>("/order", {
    method: "POST",
    body: JSON.stringify({ data: payload }),
  });
}

// UPDATE ORDER
export async function updateOrder(orderId: number, payload: { qty?: number; add_on_ids?: number[] }) {
  return apiFetch<OrderResponse>(`/order/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ data: payload }),
  });
}

// PAY NOW — transitions order from draft → waiting_for_payment
export async function payNowOrder(orderId: number) {
  return apiFetch<OrderResponse>(`/order/${orderId}/pay_now`, {
    method: "POST",
  });
}

// CHECK PAYMENT STATUS
export async function checkPaymentStatus(orderId: number) {
  return apiFetch<CheckPaymentStatusResponse>(
    `/order/${orderId}/check_payment_status`,
  );
}

// MARK ORDER PAID (dummy payment integration)
export async function markOrderPaid(orderId: number) {
  return apiFetch<OrderResponse>(`/order/${orderId}/paid`, { method: "POST" });
}

// CANCEL ORDER (dummy payment integration)
export async function cancelOrder(orderId: number) {
  return apiFetch<OrderResponse>(`/order/${orderId}/cancel`, {
    method: "POST",
  });
}

// GET PAYMENT PAGE DETAILS (public, no auth needed)
export async function getPaymentDetails(bookingCode: string) {
  return apiFetch<PaymentPageDetails>(`/payment/${bookingCode}`);
}

// SUBMIT REVIEW
export async function submitReview(
  orderId: number,
  payload: { rating: number; comment: string },
) {
  return apiFetch<{ message: string; data: ReviewData }>(`/order/${orderId}/review`, {
    method: "POST",
    body: JSON.stringify({ data: payload }),
  });
}

/* =========================
   WISHLIST API
========================= */

export type WishlistDestination = {
  id: number;
  name: string;
  date: string;
  descriptions: string;
  start_time: string;
  end_time: string;
  image_url: string | null;
  latitude: string;
  longitude: string;
  price: string;
  ticket_type: string;
  category: { id: number; name: string; image_url: string | null };
};

export async function getWishlists() {
  return apiFetch<WishlistDestination[]>("/wishlists");
}

export async function addWishlist(destinationId: number) {
  return apiFetch<{ message: string }>("/wishlist", {
    method: "POST",
    body: JSON.stringify({ data: { destination_id: destinationId } }),
  });
}

export async function removeWishlist(destinationId: number) {
  return apiFetch<{ message: string }>(`/wishlist/${destinationId}`, {
    method: "DELETE",
  });
}

/* =========================
   ORDER HISTORY API
========================= */

export type OrderHistoryItem = {
  id: number;
  booking_code: string;
  qty: number;
  sub_total: string;
  tax: string;
  order_total: string;
  status: string;
  created_at: string;
  updated_at: string;
  order_item: {
    type?: string;
    id: number;
    name: string;
    date: string;
    start_time: string;
    end_time: string;
    image_url: string | null;
    price: string;
    category_id: number;
    category_name: string;
    facilities?: string[];
  };
  visitor_details: OrderVisitorDetail[];
  order_add_ons?: { id: number; name: string; price: string }[];
  can_review?: boolean;
  review?: ReviewData | null;
};

export async function getOrderHistories() {
  return apiFetch<OrderHistoryItem[]>("/order_histories");
}

export async function getOrderHistory(id: number) {
  return apiFetch<OrderHistoryItem>(`/order_history/${id}`);
}

export async function getOrderById(id: number) {
  return apiFetch<OrderResponse>(`/order/${id}`);
}

// CREATE ORDER VISITOR DETAILS
export async function createOrderVisitorDetails(
  orderId: number,
  visitors: { name: string; email: string; phone_number: string }[],
) {
  return apiFetch<OrderResponse>(`/order/${orderId}/visitor_details`, {
    method: "POST",
    body: JSON.stringify({ data: visitors }),
  });
}
//UPDATE & CREATE DESTINATION (ADMIN)
export type UpsertDestinationPayload = {
  name: string;
  descriptions: string;
  price: number;
  category_id: number;
  image_url: string;
  date: string;        // "YYYY-MM-DD"
  start_time: string;  // "HH:MM"
  end_time: string;    // "HH:MM"
  latitude: number;
  longitude: number;
  ticket_type: string; // default "destination"
};

export async function createDestination(payload: UpsertDestinationPayload) {
  return apiFetch<DestinationDetail>("/destination", {
    method: "POST",
    body: JSON.stringify({ data: payload }),
  });
}

export async function updateDestination(
  id: string | number,
  payload: Partial<UpsertDestinationPayload>,
) {
  return apiFetch<DestinationDetail>(`/destination/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ data: payload }),
  });
}

export async function deleteDestination(id: string | number) {
  return apiFetch<{ message: string }>(`/destination/${id}`, {
    method: "DELETE",
  });
}

export async function uploadImage(file: File): Promise<string> {
  const { upload_url, public_url } = await apiFetch<{ upload_url: string; public_url: string }>(
    "/upload/presign",
    {
      method: "POST",
      body: JSON.stringify({ data: { content_type: file.type } }),
    },
  );
  await fetch(upload_url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
      "x-amz-acl": "public-read",
    },
  });
  return public_url;
}

/* =========================
   ADMIN DASHBOARD API
========================= */

export type AdminDashboardResponse = {
  period: { type: string; start_date: string; end_date: string };
  summary: { total_sales: number; total_orders: number; active_destinations: number };
  chart: { destination_id: number; name: string; total_sales: number; total_orders: number }[];
};

export type DestinationBuyerItem = {
  order_id: number;
  booking_code: string;
  buyer_name: string;
  buyer_email: string;
  qty: number;
  purchased_at: string;
  order_total: number;
  status: string;
};

export type DestinationBuyersResponse = {
  destination: { id: number; name: string };
  data: DestinationBuyerItem[];
  meta: { page: number; per_page: number; total: number };
};

export async function getAdminDashboard(params?: {
  period?: "daily" | "weekly" | "monthly";
  start_date?: string;
  end_date?: string;
}) {
  const q = new URLSearchParams();
  if (params?.period) q.set("period", params.period);
  if (params?.start_date) q.set("start_date", params.start_date);
  if (params?.end_date) q.set("end_date", params.end_date);
  return apiFetch<AdminDashboardResponse>(`/admin/dashboard${q.toString() ? `?${q}` : ""}`);
}

export async function getDestinationBuyers(
  destinationId: number | string,
  params?: {
    status?: string;
    start_date?: string;
    end_date?: string;
    sort?: "created_at" | "order_total";
    direction?: "asc" | "desc";
    page?: number;
    per_page?: number;
  },
) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.start_date) q.set("start_date", params.start_date);
  if (params?.end_date) q.set("end_date", params.end_date);
  if (params?.sort) q.set("sort", params.sort);
  if (params?.direction) q.set("direction", params.direction);
  if (params?.page) q.set("page", String(params.page));
  if (params?.per_page) q.set("per_page", String(params.per_page));
  return apiFetch<DestinationBuyersResponse>(
    `/admin/destination/${destinationId}/buyers${q.toString() ? `?${q}` : ""}`,
  );
}
