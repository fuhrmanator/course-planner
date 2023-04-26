/* test for CAP DSL */
/* currently parsing works, but no results generated */ 
/* Javascript goes inside the {} */

Expression
  = Spacing Rule+ EndOfFile

Rule
/* define specific rules for the activity types */
  = head:ExamActivity _ tail:Timing Spacing {
        head.open = tail;
        return head;
    }
    / activity:MoodleQuizActivity _ opens:MoodleQuizOpenTime _ closes:MoodleQuizCloseTime Spacing {
      activity.open = opens;
      activity.close = closes;
      return activity;
    }
    / activity:MoodleHomeworkActivity _ opens:MoodleHomeworkAllowSubmissionsTime _ due:MoodleHomeworkDueTime _ cutoff:MoodleHomeworkCutoffTime Spacing {
      activity.open = opens;
      activity.due = due;
      activity.cutoff = cutoff;
      return activity;
    }

ExamActivity
  = head:EXAM_ACTIVITY_CODE tail:Integer {
    return {"type": head, "i": tail};
  }
MoodleQuizActivity 
  = head:MOODLE_QUIZ_ACTIVITY_CODE tail:Integer {
    return {"type": head, "i": tail}
  }
MoodleQuizOpenTime "Moodle Quiz Open Time" = Timing  
MoodleQuizCloseTime "Moodle Quiz Close Time" = Timing  

MoodleHomeworkActivity 
  = head:MOODLE_HOMEWORK_ACTIVITY_CODE tail:Integer {
    return {"type": head, "i": tail};
  }
MoodleHomeworkAllowSubmissionsTime "Moodle Homework Allow Submissions Time" = Timing  
MoodleHomeworkDueTime "Moodle Homework Due Time" = Timing  
MoodleHomeworkCutoffTime "Moodle Homework Cutoff Time" = Timing

Activity "Activity Number (e.g., E1 for Exam 1)"
 = head:ActivityCode tail:Integer {
     return {"type": head, "i": tail};
   }

Timing
/* Case for Session, Labs, Practica */
  = head:MeetingSequence tail:TimeModifier? {
    var result = head, i;
    if (tail !== null) {
        if (tail["modifier"] !== null) {
            result.modifier = tail["modifier"];
        }
        var time = {}
        if (tail["offset"] !== null) {
            time.modifier = tail["offset"][0]
            time.number = tail["offset"][1][0]
            time.type = tail["offset"][1][1]
        }
        if (tail["at"] !== null) {
            time.at = tail["at"][1];
        }
        if (Object.keys(time).length > 0) {
            result.time = time;
        }
        var modif = {};
    }

    return result;
  }

ActivityCode 
  = code:(EXAM_ACTIVITY_CODE / MOODLE_QUIZ_ACTIVITY_CODE / MOODLE_HOMEWORK_ACTIVITY_CODE) { return code; }

MeetingSequence "Meeting Number (e.g., S2 for Seminar 2)"
  = meeting:(SEMINAR_MEETING / LABORATORY_MEETING / PRACTICUM_MEETING) number:Integer { return {"type": meeting, "i": number}}

TimeModifier
  = time:(MEETING_START / MEETING_END) offset:(('-'/'+') DeltaTime)? at:('@' HHMM)? {return {"modifier":time, "offset":offset, "at":at}} /
  offset:(('-'/'+') DeltaTime)? at:('@' HHMM)? {return {"modifier":null, "offset":offset, "at":at}} /
  at:('@' HHMM) {return {"modifier":null, "offset":null, "at":at}}

DeltaTime 
  = Integer ('m' / 'h' / 'd' / 'w') 

HHMM
  = ([2][0-3] / [0-1]?[0-9] / [0-9]) ':' [0-5][0-9] { return text() }

Integer "integer"
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t]*

EXAM_ACTIVITY_CODE 
  = ('Exam' / 'E') { return "Exam"}
MOODLE_QUIZ_ACTIVITY_CODE 
  = ('Quiz' / 'Q') { return "Quiz"}
MOODLE_HOMEWORK_ACTIVITY_CODE 
  = ('Homework' / 'H') { return "Homework"}

SEMINAR_MEETING 
  = ('Seminar' / 'S'){return 'Seminar'; }
LABORATORY_MEETING
  = ('Laboratory' / 'L') {return 'Laboratory'; }
PRACTICUM_MEETING
  = ('Practicum'/ 'P') {return 'Practicum'; }

MEETING_START 
  = ('Start'/ 'S') {return 'Start'; }
MEETING_END 
  = ('Finish' / 'F' / 'End' / 'E') {return 'End'; }

Spacing 
  = (Space / Comment)*
Comment 
  = '#' (!EndOfLine .)* EndOfLine { return 'comment';}
Space 
  = ' ' / '\t' / EndOfLine
EndOfLine 
  = '\r\n' / '\n' / '\r'
EndOfFile 
  = !. { return "EOF"; }