import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";

export default function SubjectProgress({ subjects }) {
  return (
    <Card variant="default">
      <h3 className="font-display text-base font-medium text-ink mb-4">Subject progress</h3>
      <ul className="space-y-5">
        {subjects.map((subject) => (
          <li key={subject.subjectId}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-ink">{subject.title}</span>
              <span className="text-xs text-ink-faint">{subject.overallPercent}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${subject.overallPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="neutral">
                {subject.quizAvg !== null ? `Quiz avg ${subject.quizAvg}%` : "No quizzes yet"}
              </Badge>
              <Badge variant="neutral">
                {subject.flashcardMastery !== null
                  ? `Flashcards ${subject.flashcardMastery}%`
                  : "No flashcards studied"}
              </Badge>
              <Badge variant="neutral">{subject.completedTasks} tasks done</Badge>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
