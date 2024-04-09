import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import AuthService from "../services/AuthService";
import {Spin} from "antd";
import {reloadCurrentUser} from "../redux/user.slice";
import {useAppDispatch} from "../redux/store";

function ProtectedRoute(element: React.ReactNode) {
  
    const [isLogin, setIsLogin] = useState(null as (boolean | null))

    const dispatch = useAppDispatch()

    useEffect(() => {
      if (AuthService.shared.currentUser) {
        setIsLogin(true)
        dispatch(reloadCurrentUser())
      } else {
        AuthService.shared.checkAuthenticate()
          .then(user => {
            setIsLogin(user != null)
            dispatch(reloadCurrentUser())
          })
          .catch(error => {
            setIsLogin(false)
          })
      }
    }, [])

  return (
    isLogin == null ? <Spin/>
    : isLogin ? (element)
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
