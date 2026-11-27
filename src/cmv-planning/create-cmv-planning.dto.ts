import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class CreateCmvPlanningDto {
  @IsInt()
  @Min(2000)
  @Max(3000)
  year!: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  plannedAmount!: number;
}
