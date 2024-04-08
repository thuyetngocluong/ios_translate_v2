
import { Card, Flex, Typography } from "antd";
import React, { useEffect } from "react";
import LanguageService from "../services/LanguageService";
import DataScreen from "./DataScreen";

const items = [
    "Import From Excel",
    "View Data"
]

function MainScreen() {

    useEffect(() => {
        LanguageService.shared.fetchLanguages()
        .then(languages => {
            console.log(languages.length)
        })
        
    }, [])

    return <div>
       <DataScreen/>
    </div> 
}

export default MainScreen;