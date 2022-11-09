
var counter = 0;
for (let i = 0; i < 30; i++)
{
  setTimeout(() => {
    autoSearch2();
  }, i*100);
}




function autoSearch2() {

    if (document.getElementsByClassName("breadcrumb-question").length == 0 || counter > 0)
    {
        return;
    }
    else
    {
        counter++;
    }
    var elem = document.createElement('div')
    elem.className = "questions-container"

    var paper1div = document.createElement('div')
    paper1div.className = "paper-4"
    paper1div.id = "paper-4"

    var titletext = document.createElement('h3')
    titletext.textContent = "Related Questions"

    paper1div.appendChild(titletext)

    var questionlist = document.createElement('div')
    questionlist.className = "questions"

    var qtext = document.getElementsByClassName("breadcrumb-question")[0].innerText.substring(10);
    for (let i = qtext.length -1; i >= 0; i--)
    {
        if (!isNaN(qtext[i]) && qtext[i] != " ")
        {
            qtext = qtext.substring(0, i+1)
            break
        }
    }

    qtext = qtext.trim()

    
    relqurl = chrome.runtime.getURL("json/relatedquestions.json")
    scoreurl = chrome.runtime.getURL("json/questionscores.json")
    url = chrome.runtime.getURL('json/questiontextjson.json');
    pointsurl = chrome.runtime.getURL("json/questionpoints.json")
    topicurl = chrome.runtime.getURL("json/questiontopics.json")

    Promise.all([
        fetch(relqurl),
        fetch(scoreurl),
        fetch(url),
        fetch(pointsurl),
        fetch(topicurl)
    ]).then(function (responses) {
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then(function(json) {
        var questiontopics = [], relqdict = [], qscores = [], newqscores=[];
        for (var i = 0; i <= 10; i++)
        {
          questiontopics.push(json[4][i.toString()]);
        }
        for (var i = 0; i < 10; i++)
        {
          relqdict.push(json[0][qtext][i])
        }

        for (var i = 0; i < 10; i++)
        {
          qscores.push([relqdict[i], json[1][relqdict[i]]]);
        }

        for (let i = 0; i < 10; i++)
        {
          var questionlink = document.createElement('a')
          questionlink.className = "question-item undefined"
          let topicval = 1;
          for (let j = 0; j < questiontopics.length; j++)
          {
            if (questiontopics[j].includes(relqdict[i]))
            {
              topicval = j;
              break;
            }
          }
          
          if (qtext.includes("sl"))
          {
            questionlink.href = "https://pestle-ib.firebaseapp.com/math/topic/" + topicval.toString() + "/question/" + relqdict[i]
          }
          else
          {
            questionlink.href = "https://pestle-ib.firebaseapp.com/math_hl/topic/" + topicval.toString() + "/question/" + relqdict[i]
          }
          
          var questionid = document.createElement('div')
          questionid.className = "question-id"
          questionid.textContent = relqdict[i]
          questionlink.appendChild(questionid)
    
          var questionname = document.createElement('div')
          questionname.className = "question-name"
          questionname.textContent = json[2][relqdict[i]];
          questionlink.appendChild(questionname)
    
          var revisitdiv = document.createElement('div')
          revisitdiv.className = "revisit"
          questionlink.appendChild(revisitdiv)

//          console.log(qscores.length)
    
          var coolMetric = Math.round(qscores[i][1]*10)/10;
        
          if (coolMetric >= 1) {
              coolMetric = 0.9
          }
        
          var bendDegree = 1.53
          var redCode = Math.floor(Math.min(255*((2*Math.floor(2*coolMetric - 1) + 1) * Math.pow((Math.abs(2*coolMetric - 1)), bendDegree) + 1), 255)).toString(16).padStart(2, "0")
          var greenCode = Math.floor(Math.min(255*(-(2*Math.floor(2*coolMetric - 1) + 1) * Math.pow((Math.abs(2*coolMetric - 1)), bendDegree) + 1), 255)).toString(16).padStart(2, "0")
          questionlink.setAttribute("style", "border-right:7px solid " + "#" + redCode + greenCode + "00" + ";");
    
            var coolMetricDiv = document.createElement('div')
            coolMetricDiv.className = 'cool-metric'
            coolMetricDiv.setAttribute("style", "position: relative; right:-34px; top:-15px; opacity: 0.0;")
            coolMetricDiv.textContent = Math.round(coolMetric*10)
            questionlink.appendChild(coolMetricDiv)
            newqscores.push([questionlink, qscores[i][1]])
            questionlist.appendChild(questionlink)
          
          
        }

        // to sort questions by diffulty 
    
        // newqscores.sort(function(a,b){return a[1]-b[1]})
        // for (let i = 9; i >= 1; i--)
        // {
        //   questionlist.insertBefore(newqscores[i-1][0], newqscores[i][0])
        // }
    
        paper1div.appendChild(questionlist)
    
        elem.appendChild(paper1div)
    
        let markscheme = document.getElementsByClassName("markscheme-toggle")[0]
    
        markscheme.parentNode.appendChild(elem)
    
        if (document.getElementsByClassName("paper-4").length > 1)
        {
          var delelem = document.getElementsByClassName("paper-4")[0]
          delelem.parentNode.parentNode.removeChild(delelem.parentNode)
        }
    
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('javascript/tex-svg.js');
        s.onload = function() {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
          
        var hoverstyle = document.createElement('style')
        hoverstyle.textContent = `
            .question-item {
                transition: all 0.19s ease-in-out;
            }
            .question-item:hover { 
                border-right-width:19px !important; 
            }
            .question-item:hover .cool-metric {
                opacity: 1.0 !important;
            }
        `
        document.head.appendChild(hoverstyle)
    
//        console.log("related questions created")
    
        //adding the question difficulty at the right
          if (document.getElementsByClassName("newDifficultyDiv").length > 0)
          {
            var delelem = document.getElementsByClassName("newDifficultyDiv")[0]
            delelem.parentNode.removeChild(delelem)
          }
          

//        console.log("og2")
        var coolMetric = Math.round(json[1][qtext]*10)
        
        if (coolMetric >= 10) {
            coolMetric = 9
        }
        
        let actualQuestion = document.getElementsByClassName("question-out")[0]
        
        $("h3").filter(function() {
            return $(this).text() === "Question";
        }).remove()
        
        var newDivWithDifficulty = document.createElement('div')
        newDivWithDifficulty.className = "newDifficultyDiv"
        newDivWithDifficulty.innerHTML = `
                                            <table style="width: 100%; max-width: none">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <h3>Question</h3>
                                                        </td>
                                                        <td style="float: right;">
                                                            <h3 style="padding-right: 0px;">Difficulty: ${coolMetric}</h3>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            `
        
        actualQuestion.parentNode.insertBefore(newDivWithDifficulty, actualQuestion)
          
          
          //adding the timer box
        var totalNumberOfBRs = 10
        if (document.getElementsByClassName("newTimerDiv").length > 0)
        {
            var delelem = document.getElementsByClassName("newTimerDiv")[0]
            delelem.parentNode.removeChild(delelem)
        
            
            
            for (let numberOfBRs = 0; numberOfBRs < totalNumberOfBRs; numberOfBRs++)
            {
                var delelemBR = document.getElementsByClassName("timerBR")[0]
                delelemBR.parentNode.removeChild(delelemBR)
            }
        }
          


        let numMarks = json[3][qtext]
        
        //get from paper (based on year, or just based on current year)
        
        let timePerMark = 12/11
        
        if (qtext.includes("sl")) {
            timePerMark = 9/8
        }
        
        let totalSecondsGiven = Math.round(numMarks * timePerMark * 60)
        var totalSecondsLeft = totalSecondsGiven
        
        function totalSecondsToTimeText(totalSeconds) {
            totalSeconds = Math.round(totalSeconds)
            return `${Math.floor(totalSeconds/60).toString().padStart(2, "0")}:${(totalSeconds % 60).toString().padStart(2, "0")}`
        }
        
        let questionPage = document.getElementsByClassName("question-page")[0]

        var timerContainer = document.createElement('div')
        timerContainer.className = "newTimerDiv"
        timerContainer.setAttribute("style", "width: 20%; position: fixed; right: 60px; bottom: 60px; z-index: 9001;")
        
        var timerdiv = document.createElement('div')
        timerdiv.className = 'question-out'
        timerdiv.style.boxShadow = "1px 1px 14px rgba(0, 0, 0, 0.18)"
        timerdiv.style.transition = "all 0.46s ease-in-out"
        timerdiv.innerHTML = `
                            <h3 style="padding-left: 0px; padding-top: 0px; margin-top: 0px; padding-bottom: 10px;">Timer</h3>
        
                            <p style="font-family: &quot;Open Sans&quot;,helvetica neue,Arial,lucida grande,lucida sans unicode,sans-serif!important; margin-bottom: 8px;">
                                The IB would give you
                                <span style="font-weight: 900;">${totalSecondsToTimeText(totalSecondsGiven)}</span>
                                for this
                                <span style="font-weight: 600;">${numMarks}</span>
                                mark question.
                            </p>
        
                            
                            <form style="margin-bottom: 4px;">
                                <table>
                                    <tr>
                                        <td>
                                            <label for="timerPercentage" style="font-family: &quot;Open Sans&quot;,helvetica neue,Arial,lucida grande,lucida sans unicode,sans-serif!important;">Try it at</label>
                                        </td>
                                        <td>
                                            <select name="timerPercentage" id="timerPercentage" style="margin-left: 5px; margin-right: 5px">
                                                <option value="25">25%</option>
                                                <option value="50">50%</option>
                                                <option value="75">75%</option>
                                                <option value="100" selected>100%</option>
                                                <option value="125">125%</option>
                                                <option value="150">150%</option>
                                                <option value="200">200%</option>
                                            </select>
                                        </td>
                                        <td>
                                            <p style="font-family: &quot;Open Sans&quot;,helvetica neue,Arial,lucida grande,lucida sans unicode,sans-serif!important;">of this time.</p>
                                        </td>
                                    </tr>
                                </table>
                            </form>
        
                            <table style="width: 100%; max-width: none">
                                <tr style="height: 49px;">
                                    <td>
                                        <p style="font-family: &quot;Open Sans&quot;,helvetica neue,Arial,lucida grande,lucida sans unicode,sans-serif!important; font-size: 30px; margin-bottom: 8px; opacity: 1.0; transition: all 0.28s ease-in-out" id="timerCountdown">
                                            ${totalSecondsToTimeText(totalSecondsLeft)}
                                        </p">
                                    </td>
                                    <td style="height: 49px; float: right;">
                                        <img id="playpause" src=${chrome.runtime.getURL("images/playpause1.png")} style="position: relative; height: 25px; opacity: 1.0; transition: all 0.14s ease, opacity 0.15s ease; top: 8px; padding-right: 12px; user-drag: none; -webkit-user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;">
                                        <img id="restart" src=${chrome.runtime.getURL("images/restart.png")} style="position: relative; height: 25px; opacity: 1.0; transition: all 0.14s ease, opacity 0.15s ease; top: 8px; user-drag: none; -webkit-user-drag: none; user-select: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;">
                                    </td>
                                </tr>
                            </table>
        
                            <div style="height: 16px;">
                                <div style="position: relative; width: 100%; height: 16px; background-color: #f0f0f0; border-radius: 4px;">
                                    <br>
                                </div>
                                <div id="timerprogress" style="position: relative; width: 100%; height: 16px; background-color: #00ff00; border-radius: 4px; top: -16px; transition: all 1.0s linear;">
                                    <br>
                                </div>
                            </div>
                            `
        
        timerContainer.appendChild(timerdiv)
        
        questionPage.appendChild(timerContainer)
        
        var playpausebutton = document.getElementById('playpause')
        var playing = false
        var counterID = null

        var timerprogress = document.getElementById('timerprogress')
        
        function OneTick() {
            if (totalSecondsLeft < 1) {
                timerCountdown.innerHTML = "00:00"
                timerprogress.style.transition = "all 0.1s ease"
                timerprogress.style.width = "0%"
                
                timerCountdown.style.opacity = 0.0
                
                timerdiv.style.boxShadow = "0px 0px 0px 100vmax rgba(0, 0, 0, 0.64)"
                
                setTimeout(function() {
                    timerCountdown.style.opacity = 1.0
                }, 500)
            }
            
            else {
                totalSecondsLeft = totalSecondsLeft - 1
                
                timerCountdown.innerHTML = totalSecondsToTimeText(totalSecondsLeft)
                
                timerprogress.style.transition = "all 1.0s linear"
                timerprogress.style.width = (100 * (totalSecondsLeft / (timerPercentage.value * 0.01 * totalSecondsGiven))) + "%"
                
                var bendDegree = 0.88
                let progressDecimal = 1 - (totalSecondsLeft / (timerPercentage.value * 0.01 * totalSecondsGiven))
                var redCode = Math.floor(Math.min(255*((2*Math.floor(2*progressDecimal - 1) + 1) * Math.pow((Math.abs(2*progressDecimal - 1)), bendDegree) + 1), 255)).toString(16).padStart(2, "0")
                var greenCode = Math.floor(Math.min(255*(-(2*Math.floor(2*progressDecimal - 1) + 1) * Math.pow((Math.abs(2*progressDecimal - 1)), bendDegree) + 1), 255)).toString(16).padStart(2, "0")
                timerprogress.style.backgroundColor = "#" + redCode + greenCode + "00"
            }
        }
        
        function RestartTimer() {
            totalSecondsLeft = timerPercentage.value * 0.01 * totalSecondsGiven
            timerCountdown.innerHTML = totalSecondsToTimeText(totalSecondsLeft)
            
            playing = false
            playpausebutton.src = chrome.runtime.getURL("images/playpause1.png")
            clearInterval(counterID)
            
            timerprogress.style.transition = "all 0.42s ease"
            timerprogress.style.width = "100%"
            timerprogress.style.backgroundColor = "#00ff00"
            
            timerdiv.style.boxShadow = "1px 1px 14px rgba(0, 0, 0, 0.18)"
        }
        
        playpausebutton.addEventListener('click', function() {
            if (!playing) {
                playing = true
                playpausebutton.src = chrome.runtime.getURL("images/playpause2.png")
                counterID = setInterval(OneTick, 1000)
            }

            else {
                playing = false
                playpausebutton.src = chrome.runtime.getURL("images/playpause1.png")
                clearInterval(counterID)
                timerdiv.style.boxShadow = "1px 1px 14px rgba(0, 0, 0, 0.18)"
            }
        })
        
        
        var restartbutton = document.getElementById('restart')
        
        restartbutton.addEventListener('click', function() {
            RestartTimer()
        })
        
        var buttonstyles = document.createElement('style')
        buttonstyles.textContent = `
            #playpause:hover {
                opacity: 0.78 !important;
            }
            
            #playpause:active {
                opacity: 0.45 !important;
            }
        
            #restart:hover {
                opacity: 0.78 !important;
            }
        
            #restart:active {
                opacity: 0.45 !important;
            }
        `
        document.head.appendChild(buttonstyles)
        
        var timerCountdown = document.getElementById("timerCountdown")
        var timerPercentage = document.getElementById("timerPercentage")

        timerPercentage.addEventListener('change', function() {
            RestartTimer()
        })
        
        //add space at the bottom for timer
        
        for (let numberOfBRs = 0; numberOfBRs < totalNumberOfBRs; numberOfBRs++)
        {
            timerBR = document.createElement('br')
            timerBR.className = "timerBR"
            questionPage.appendChild(timerBR)
        }
        
        //the magical +
        if (document.getElementsByClassName("header-link").length > 0) {
            headerLinkBox = document.getElementsByClassName("header-link")[0]
            headerLinkBox.innerHTML = `<h2>pestle<sup style="transition: all 0.4s ease-in-out; display: inline-block; transform: rotate(0deg);" id="pestleplus">+</sup></h2>`
            
            function rotatePestlePlus() {
                pestleplusrotation = pestleplusrotation + 90
                
                var pestleplus = document.getElementById('pestleplus')
                
                //check to see if now in a non-topic/non-question page, in which case, stop this timer
                var items = document.querySelectorAll('div.question-id')
                
                if (items.length == 0) {
                    clearInterval(rotateID)
                }
                
                else {
                    pestleplus.style.transform = `rotate(${pestleplusrotation}deg)`
                }
            }
            
            if (typeof rotateID === 'undefined') {
                var pestleplusrotation = 0
                rotateID = setInterval(rotatePestlePlus, 5000);
            }
            
            else {
                clearInterval(rotateID);
                var pestleplusrotation = 0
                rotateID = setInterval(rotatePestlePlus, 5000);
            }
        }
    })
      
}
