
export const autentificar = async (data) => {
    const URL = "../api/auth";
    
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const jsonData = await response.json()
            return jsonData;
        } else {
            const errorMessage = await response.json();
            return { code: response.status, message: errorMessage.message };
        }
    } catch (error) {
        throw error;       
    }
};

export const GET_RESOURCES = async (URL,token) => {
    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth_token": token
            },
        });

        if (response.ok) {
            const jsonData = await response.json()
            return jsonData;
        }
    }
    catch (error) {
        throw error;
    }
}

export const POST_RESOURCES = async (URL, data, token) => {
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth_token": token
            },
            body: JSON.stringify(data)
        }); 

        if (response.ok) {
            const jsonData = await response.json()
            return jsonData;
        }

    }
    catch (error) {
        throw error;
    }
}

export const PUT_RESOURCES = async (URL, data, token) => {
    try {
        const response = await fetch(URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth_token": token
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const jsonData = await response.json()
            return jsonData;
        }
    }
    catch (error) {
        throw error;
    }
}

export const DELETE_RESOURCES = async (URL, token) => {
    try {
        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth_token": token
            }
        });

        if (response.ok) {
            const jsonData = await response.json()
            return jsonData;
        }
    }
    catch (error) {
        throw error;
    }
}