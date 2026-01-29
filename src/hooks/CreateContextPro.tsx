import { useEffect, useReducer, type ReactNode } from "react";
import { MyContext } from "../context/MyContext";
import type { OrderProduct, Product, User } from "../types/types";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient/apiClient";

export interface TypeState {
  user: User | null;
  isLoading: boolean;
  cart: Product[];
  roles: string[];
  orderProducts: OrderProduct[];
}

type SET_USER = { type: "SET_USER"; payload: User | null };
type LOGOUT = { type: "LOGOUT" };
type SET_LOADING = { type: "SET_LOADING"; payload: boolean };
type REMOVE_FROM_CART = { type: "REMOVE_FROM_CART"; payload: string };
type ADD_TO_CART = { type: "ADD_TO_CART"; payload: Product };
type INCREASE_QUANTITY = { type: "INCREASE_QUANTITY"; payload: string };
type DECREASE_QUANTITY = { type: "DECREASE_QUANTITY"; payload: string };
type CLEAR_CART = { type: "CLEAR_CART" };
type GET_PRODUCTS = { type: "GET_ALL_ORDER_PRODUCTS"; payload: OrderProduct[] };
type UPDATE_USER = { type: "UPDATE_USER"; payload: Partial<User> };


type Action =
  | SET_USER
  | LOGOUT
  | SET_LOADING
  | REMOVE_FROM_CART
  | ADD_TO_CART
  | INCREASE_QUANTITY
  | DECREASE_QUANTITY
  | CLEAR_CART
  | UPDATE_USER
  | GET_PRODUCTS;

function reducer(state: TypeState, action: Action): TypeState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "ADD_TO_CART":
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };

    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((p) => p.id !== action.payload) };

    case "INCREASE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((p) =>
          p.id === action.payload ? { ...p, quantity: (p.quantity ?? 1) + 1 } : p
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((p) =>
          p.id === action.payload ? { ...p, quantity: (p.quantity ?? 1) - 1 } : p
        ),
      };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "GET_ALL_ORDER_PRODUCTS":
      return { ...state, orderProducts: action.payload };

    case "UPDATE_USER":
      return state.user
        ? { ...state, user: { ...state.user, ...action.payload } }
        : state;

    default:
      return state;
  }
}

function CreateContextPro({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, {
    user: null,
    isLoading: true,
    cart: JSON.parse(localStorage.getItem("cart") || "[]") as Product[],
    roles: [],
    orderProducts: [],
  });

  // cart -> localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const fetchUser = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch({ type: "SET_USER", payload: null });
        return;
      }

      const res = await apiClient.get<User>("/users/me");
      dispatch({ type: "SET_USER", payload: res.data });
    } catch (e )  {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      dispatch({ type: "SET_USER", payload: null });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // app start
  useEffect(() => {
    fetchUser();
  }, []);

  // role redirect
  useEffect(() => {
    if (!state.user) return;

    if (state.user.roles?.includes("admin")) return;
    if (state.user.roles?.includes("waiter")) navigate("/waiter");
    else if (state.user.roles?.includes("chef")) navigate("/chef");
  }, [state.user, navigate]);

  return <MyContext.Provider value={{ state, dispatch }}>{children}</MyContext.Provider>;
}

export default CreateContextPro;
