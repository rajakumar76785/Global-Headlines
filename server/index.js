const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

function fetchNews(url, res){
    axios.get(url)
    .then(response => {
        if(response.data.totalResults > 0){
            res.json({
                status:200,
                success:true,
                message:"successfully fetched data",
                data:response.data
            });
        }
        else{
            res.json({
                staus:500,
                success:true,
                message:"No more result found"
            })
        }
    })
    .catch(error => {
        res.json({
            status:500,
            success:false,
            message:"Failed to fetched data from the API",
            error:error.message
        })
    })
}

app.get("/all-news", (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 40;
    let page = parseInt(req.query.page) || 1;
    if (pageSize === undefined || page === undefined || page <= 0) {
      page = 1;
      pageSize = 80;
    }
  
    let url = `https://newsapi.org/v2/everything?q=page=${page}&pageSize=${pageSize}&apiKey=${process.env.API_KEY}`;
    fetchNews(url,res);
});

app.get("/top-headlines", (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 30;
    let page = parseInt(req.query.page) || 1;
    let category = req.query.category || "business";
    if (pageSize === undefined || page === undefined || page <= 0) {
      page = 1;
      pageSize = 80;
    }
    let url = `https://newsapi.org/v2/top-headlines?category=${category}&language=en&page=${page}&pageSize=${pageSize}&apiKey=${process.env.API_KEY}`;
    fetchNews(url,res);
});

app.get("/country/:iso", (req, res) => {
    let pageSize = parseInt(req.query.pageSize) || 20;
    let page = parseInt(req.query.page) || 1;
    if (pageSize === undefined || page === undefined || page <= 0) {
      page = 1;
      pageSize = 80;
    }
    const country = req.params.iso; // provide The 2-letter ISO 3166-1 code of the country
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${process.env.API_KEY}&page=${page}&pageSize=${pageSize}`;
    fetchNews(url,res);
});

  const PORT = process.env.PORT;
app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})