import React, { Component, useEffect, useState } from "react";
import { Navigate, Route, RouteProps, RouterProps, useOutletContext } from "react-router-dom";
import AuthService from "../services/AuthService";
import { Link } from "react-router-dom";
import { error } from "console";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/user.redux";

function ProtectedRoute(element: React.ReactNode) {
  
    const [isLogin, setIsLogin] = useState(null as (boolean | null))

    const dispatch = useDispatch()

    useEffect(() => {

        AuthService.shared.checkAuthenticate()
        .then(isLogin => {
            setIsLogin(isLogin)
            dispatch(updateUser(AuthService.shared.currentUser))
        })
        .catch(error => {
            setIsLogin(false)
        })
    }, [])

  return (
    isLogin == null ? <Spin/> 
    : isLogin == true ? (element)
    : (
    <Navigate
          to={{
            pathname: "/login",
          }}
        />
      )
  )
}

export default ProtectedRoute;
