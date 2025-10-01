import { useEffect, useState } from "react";
import type {User } from "../types/types";
import {collection, doc, getDocs, orderBy, query, updateDoc, } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const q = query(collection(db, "users"), orderBy("createdAt", "asc"));

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(q);
      const users: User[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRoles: string[]) => {
    try {
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, { roles: newRoles }); 

      toast.success("User roles updated!");
      await getUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update roles");
    }
  };


  return { users, loading, updateUserRole };
}

export default useUsers;
