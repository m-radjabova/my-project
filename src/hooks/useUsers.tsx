import { useEffect, useState } from "react";
import apiClient from "../apiClient/apiClient";
import type { User } from "../types/types";

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await apiClient.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async (user: User) => {
    try {
      const response = await apiClient.post("/users", user);
      setUsers([...users, response.data]);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const updateUser = async (user: User) => {
    try {
      const response = await apiClient.put(`/users/${user.id}`, user);
      setUsers(users.map((u) => (u.id === user.id ? response.data : u)));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await apiClient.delete(`/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const incrementAge = async (id: number) => {
    try {
      const response = await apiClient.patch(`/users/${id}/age/increment`);
      setUsers(users.map((user) => (user.id === id ? response.data : user)));
    } catch (error) {
      console.error("Error incrementing age:", error);
    }
  };

  const decrementAge = async (id: number) => {
    try {
      const response = await apiClient.patch(`/users/${id}/age/decrement`);
      setUsers(users.map((user) => (user.id === id ? response.data : user)));
    } catch (error) {
      console.error("Error decrementing age:", error);
    }
  };

  return { users, addUser, updateUser, deleteUser, incrementAge, decrementAge };
}

export default useUsers;
