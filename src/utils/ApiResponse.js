class ApiResponse {
    constructor(status, message = "Success", data = null) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = status >= 200 && status < 300;
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
            data: this.data
        };
    }
}

export default ApiResponse;