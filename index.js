const cheerio = require("cheerio");
const axios = require("axios");
const xlsx = require("xlsx");

async function fun() {
  try {
    let response = await axios.get(
      "https://www.quikr.com/jobs/full-stack-developer+zwqxj1519612219"
    );

    const $ = cheerio.load(response.data);

    const jobs = $(".col-lg-9 .job-card")
      .map((index, element) => {
        const jobTitle = $(element).find(".job-title").text().trim();
        const companyName = $(element).find(".attributeVal").text().trim();
        const location = $(element).find(".city b").text().trim();
        const jobType = $(element)
          .find(".m-salary .attributeVal")
          .text()
          .trim();
        const postedDate = $(element).find(".jsPostedOn").text().trim();
        const jobDescription = $(element).next().text().trim();

        return {
          "Job Title": jobTitle,
          "Company Name": companyName,
          Location: location,
          "Job Type": jobType,
          "Posted Date": postedDate,
          "Job Description": jobDescription,
        };
      })
      .get();

    // Create a new workbook
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(jobs);

    // Add the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Jobs");

    // Write the workbook to a file
    const fileName = "jobs.xlsx";
    xlsx.writeFile(workbook, fileName);

    console.log("Jobs data has been written to", fileName);
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
}

fun();
