const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  function getLearnerData(course, ag, submissions) {

    function parseDate(dateStr) {
        try {
            return new Date(dateStr);
        } catch (error) {
            throw new Error('Invalid date format');
        }
    }

    
    if (ag.course_id !== course.id) {
        throw new Error('AssignmentGroup course_id does not match CourseInfo id');
    }

    const result = [];
    const now = new Date();
    
    
    const learnerData = {};

    submissions.forEach(sub => {
        const { learner_id, assignment_id, submission } = sub;
        const assignment = ag.assignments.find(a => a.id === assignment_id);

        if (!assignment) {
            throw new Error(`Assignment with ID ${assignment_id} not found in assignment group`);
        }

        const dueDate = parseDate(assignment.due_at);

       
        if (now < dueDate) return;

       
        let score = submission.score;
        if (parseDate(submission.submitted_at) > dueDate) {
            score -= 0.1 * assignment.points_possible;
        }

        const percentage = score / assignment.points_possible;

    
        if (!learnerData[learner_id]) {
            learnerData[learner_id] = {
                id: learner_id,
                avg: 0,
                totalWeightedScore: 0,
                totalPossiblePoints: 0,
                assignments: {}
            };
        }

        learnerData[learner_id].assignments[assignment_id] = percentage;
        learnerData[learner_id].totalWeightedScore += percentage * assignment.points_possible;
        learnerData[learner_id].totalPossiblePoints += assignment.points_possible;
    });

    for (const learner_id in learnerData) {
        const learner = learnerData[learner_id];
        learner.avg = learner.totalWeightedScore / learner.totalPossiblePoints;
        delete learner.totalWeightedScore;
        delete learner.totalPossiblePoints;

        result.push({
            id: learner.id,
            avg: learner.avg,
            ...learner.assignments
        });
    }

    return result;
}


const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
