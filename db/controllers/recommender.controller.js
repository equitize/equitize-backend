const startupService = require("../services/startup.service");


function shuffle(array) {
    // https://stackoverflow.com/a/2450976/5894029
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array
}


exports.getAndSortStartups = async (req, res) => {
    const retailInvestor = req.body.retailInvestor;
    const industries = await retailInvestor.getIndustryPreferences();
    let startups = await startupService.findAll();
    startups = shuffle(startups)  // make answer non-deterministic

    let industyNameToIdx = {};
    let industryIdxToStartupIdxs = new Array();

    for (idx in industries){
        industryName = industries[idx].name
        industyNameToIdx[industryName] = idx
        industryIdxToStartupIdxs.push(new Array())
    }

    for (startupIdx in startups){
        let startupIndustries = startups[startupIdx].industries
        for (tmpIdx in startupIndustries){
            let industryName = startupIndustries[tmpIdx].name
            if (industryName in industyNameToIdx){
                industryIdxToStartupIdxs[industyNameToIdx[industryName]].push(startupIdx)
            }
        }
    }

    // console.log(industryIdxToStartupIdxs)

    let startupsAlreadyAllocated = new Set(); 
    let startupsRecommendedOrder = new Array();
    let ptr = 0;

    while (ptr < startups.length){
        for (idx in industries){
            industryName = industries[idx].name
            if (industryIdxToStartupIdxs[idx].length == 0){continue}
            let startupIdx = parseInt(industryIdxToStartupIdxs[idx].pop())
            if (startupsAlreadyAllocated.has(startupIdx)){continue}
            startupsRecommendedOrder.push(startups[startupIdx])
            startupsAlreadyAllocated.add(startupIdx)
        }
        while (ptr < startups.length){
            let startupIdx = ptr
            ptr += 1
            if (startupsAlreadyAllocated.has(startupIdx)){continue}
            startupsRecommendedOrder.push(startups[startupIdx])
            startupsAlreadyAllocated.add(startupIdx)
            break
        }
    }
    res.send(startupsRecommendedOrder)
}
