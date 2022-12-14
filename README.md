# PestlePlus
## Overview
PestlePlus is a chrome extension that works on top of the Pestle website (https://pestle-ib.firebaseapp.com/). This website has a list of questions from past International Baccleaureate (IB) papers arranged by subject. Pestleplus currently works for the Math SL and Math HL subjects.

### Key Features:
- **Question difficulty** - Assigns each question a difficulty and display questions sorted by difficulty
- **Related questions** - Displays related questions in terms of content for a given question
- **Timer functionality** - Provides timer functionality so that studens can attempt questions with under real exam time limits 

Pestle was initially scraped to compute question difficulty and related questions, the results of which were then stored in json files. PestlePlus therefore alters the apperance of Pestle to reflect the stored information and to make the website more dynamic.

|Without PestlePlus|
|---|
|![Screenshot 2022-12-08 at 11 38 41](https://user-images.githubusercontent.com/46422100/206428991-a976aa83-4349-4a7b-aac4-4753846ce7fc.png)|
|![Screenshot 2022-12-08 at 11 50 30](https://user-images.githubusercontent.com/46422100/206429127-d789ce34-8e3e-443a-9bb6-1ae256a31a2d.png)| 

|With PestlePlus|
|---|
|![PeslePlus1](https://user-images.githubusercontent.com/46422100/206429358-85ce2c62-dce5-4696-a874-1a2367599a53.png)|
|![Screenshot 2022-12-08 at 11 36 41](https://user-images.githubusercontent.com/46422100/206429385-cb0d92ac-ae1d-46f5-bafe-3a0985112ffd.png)| 

The following sections detail how the extension's three key features function.

### Question difficulty

The majority of quesions on Pestle are accompanied by examiner remarks which detail how students performed on that question. These remarks share a common feature in that they always mention a proportion of students followed by how the students performed. For example, "This was *well done* by *most candidates* who correctly applied de Moivre's theorem." Therefore, a named entity recognition model using spaCy in Python was trained on 100 examiner remarks to identify words referring to proportions of students and words referring to the students' performance. These words were then collated into a list and manually annotated with a score between 0 and 1, where 1 represented all students for the proportion score and excellent for the performance score. These scores for each question were then input to an equation that outputted a difficulty score between 0 and 1 with 1 representing the hardest questions. Finally, the final difficulty score of a question was a weighted average of the difficulty score from the examiner remarks, the question number, and the number of points for the question with the heaviest weighting placed on the first component. 

### Related questions

The main idea here was that related questions would contain similar/the same math terminology, so the approach used is similar to that of document distance. Initially, a math dictionary was scraped to produce a list of math terminology. Then, word frequency vectors were created for each question based on the list of math terminology. For a given question, the angle between that question's vector and all other questions' vectors were computed and the related questions were taken to be the 10 questions that produced the smallest angle with the given question. Due to the computatinal complexity of computing the angle beween 100+ dimensional vectors for 1000+ vectors, it was decided that this should be done in preprocessing and the related questions for each question should be stored in json files. 

### Timer functionality

On each question page of Pestle, PestlePlus adds a floating timer in the bottom right of the page. The timer calculates the time a student would be allowed on that question using the number of points the question is worth and real IB exam time constraints. The timer then allows students to attempt the question with a time limit ranging from 25% to 200% of the allowed time, catering to students of all abilities. The timer is accompanied by a progress bar that changes gradually from green to red as time runs out. 
