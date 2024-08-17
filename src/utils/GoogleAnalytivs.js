const path = require('path');
/**
   * TODO(developer): Uncomment this variable and replace with your
   *   Google Analytics 4 property ID before running the sample.
   */
  propertyId = '242159226';

  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'thesnuslife-2d66a8b12ac7.json');
  // Imports the Google Analytics Data API client library.
  const {BetaAnalyticsDataClient} = require('@google-analytics/data');

  // Using a default constructor instructs the client to use the credentials
  // specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
  const analyticsDataClient = new BetaAnalyticsDataClient();

  // Runs a simple report.
  async function runReport() {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2023-11-01',
          endDate: 'today',
        },
      ],
      dimensions: [
        // {
        //   name: 'country',
        // },
        {name:"date"}
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
        {
            name: 'totalUsers', // Add another metric
          },
          {
            name: 'sessions', // Add another metric
          },
          {
            name: 'newUsers', // Add the 'newUsers' metric
         },
          {
            name: 'eventCount', // Add the 'newUsers' metric
          },
        
      ],
    });

    console.log('Report result:');
    response.rows.forEach(row => {
      console.log("active users",row.dimensionValues[0], row.metricValues[0]);
      console.log("total users----", row.metricValues[1]);
      console.log("session", row.metricValues[2]);
      console.log("new users", row.metricValues[3]);
      console.log("event counts", row.metricValues[4]);

    });
  }

  
  module.exports.runReport=runReport;