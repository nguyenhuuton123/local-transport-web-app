import {EXPIRY_DAY} from "@/constant/appConstant";

export const setLocalStorageValue = (name, value, days) => {
    const expires = new Date().getTime() + days * EXPIRY_DAY;
    const data = {
        value: value,
        expiryTime: expires
    }
    localStorage.setItem(name, JSON.stringify(data));
}

export const getLocalStorageValue = (name) => {
    let result = null;
    if (typeof window !== "undefined" && window.localStorage) {
        result = localStorage.getItem(name);
        result = result ? JSON.parse(result) : null;
    }
    return result;
}