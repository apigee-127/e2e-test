apigee-api-workshop-v2
======================

This is the 2nd version of a sample Node.js app that we build in Apigee's ABCs of APIs workshop. The app shows a list of restaurants, drills down to an individual restaurant showing its details, average rating, a map, and reviews for the restaurant. You can add up to two reviews per hour.

After cloning/downloading the app, you need to go into config.js in the root level of the project and change the Server: and UG: values to match where you are running the app and where your Usergrid database is located. The config file currently hits an instance of my API BaaS which contains sample restaurant and reviews data.

```javascript
module.exports = {
	// Server address
	Server: "http://localhost:8888",
	// Usergrid path
	UG: "http://localhost:8080/workshop/sandbox"
}
```
If you have an Apigee API BaaS account, you can populate your Sandbox app with sample data by going to http://grewis-test.apigee.net/api-restaurants/setup/{YOUR ORGNAME}?location={AN ADDRESS OR CITY}

Then, start app.js. Using http://localhost:10010/restaurants and http://localhost:10010/reviews you should see your sample data.
