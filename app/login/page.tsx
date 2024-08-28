"use client";

import { createClient } from "@/utils/supabase/client";
import React from "react";

const LoginPage = () => {
  const supabase = createClient();
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "test@gmail.com",
      password: "12341234",
    });

    if (error) console.error(error);
  };

  return <button onClick={handleLogin}>Log in</button>;
};

export default LoginPage;
