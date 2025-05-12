const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'http://20.244.56.144/evaluation-service/stocks',
    headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDI4MzczLCJpYXQiOjE3NDcwMjgwNzMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM5MjMyMzAwLTUzNzAtNGVkYy1hZGE1LTRjNTFmMmIxOWE5NiIsInN1YiI6InZpc2hhbHJzLjIyYWlkQGtvbmd1LmVkdSJ9LCJlbWFpbCI6InZpc2hhbHJzLjIyYWlkQGtvbmd1LmVkdSIsIm5hbWUiOiJ2aXNoYWwgcnMiLCJyb2xsTm8iOiIyMmFkcjEyMSIsImFjY2Vzc0NvZGUiOiJqbXBaYUYiLCJjbGllbnRJRCI6ImM5MjMyMzAwLTUzNzAtNGVkYy1hZGE1LTRjNTFmMmIxOWE5NiIsImNsaWVudFNlY3JldCI6IlluZnRlRHZnRlJZc2pBd24ifQ.jbwoAwMuVkv46tI9tl9XkgcnwypTRriGifRwkAtrnW4'
    }
});

module.exports = axiosInstance;