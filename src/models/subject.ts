export type ScoreLevel = 'Excellent' | 'Good' | 'Average' | 'Poor';

export abstract class ExamSubject {
  abstract readonly name: string;
  abstract readonly code: string;

  classifyLevel(score: number): ScoreLevel {
    if (!this.isValidScore(score)) {
      throw new Error(`Invalid score ${score} for subject ${this.name}`);
    }
    if (score >= 8.0) return 'Excellent';
    if (score >= 6.0) return 'Good';
    if (score >= 4.0) return 'Average';
    return 'Poor';
  }

  isValidScore(score: number): boolean {
    return score >= 0 && score <= 10;
  }
}

export class StandardSubject extends ExamSubject {
  constructor(public readonly code: string, public readonly name: string) {
    super();
  }
}

export class LiteratureSubject extends ExamSubject {
  readonly code = 'ngu_van';
  readonly name = 'Ngữ văn';

  override isValidScore(score: number): boolean {
    return super.isValidScore(score);
  }
}

export class ForeignLanguageSubject extends ExamSubject {
  readonly code = 'ngoai_ngu';
  readonly name = 'Ngoại ngữ';

  override isValidScore(score: number): boolean {
    return super.isValidScore(score);
  }
}

export class SubjectRegistry {
  private static subjects: Record<string, ExamSubject> = {
    toan: new StandardSubject('toan', 'Toán'),
    ngu_van: new LiteratureSubject(),
    ngoai_ngu: new ForeignLanguageSubject(),
    vat_li: new StandardSubject('vat_li', 'Vật lí'),
    hoa_hoc: new StandardSubject('hoa_hoc', 'Hóa học'),
    sinh_hoc: new StandardSubject('sinh_hoc', 'Sinh học'),
    lich_su: new StandardSubject('lich_su', 'Lịch sử'),
    dia_li: new StandardSubject('dia_li', 'Địa lí'),
    gdcd: new StandardSubject('gdcd', 'GDCD'),
  };

  static getSubject(code: string): ExamSubject | undefined {
    return this.subjects[code];
  }

  static getAllSubjects(): ExamSubject[] {
    return Object.values(this.subjects);
  }
}
