import { IsBoolean, IsString, IsNumber, Min, Max, IsLongitude, IsLatitude } from "class-validator";
import { Expose, Transform } from "class-transformer";

export { ApproveReportDto, CreateReportDto, GetEstimateDto, ReportDto };

// ApproveReport
class ApproveReportDto {
	@IsBoolean()
	approved: boolean;
}
// Report
class ReportDto {
	@Expose()
	id: number;
	@Expose()
	price: number;
	@Expose()
	year: number;
	@Expose()
	lng: number;
	@Expose()
	lat: number;
	@Expose()
	make: string;
	@Expose()
	model: string;
	@Expose()
	mileage: number;
	@Expose()
	approved: boolean;

	@Transform(({ obj }) => obj.user.id)
	@Expose()
	userId: number;
}
// CreateReport
class CreateReportDto {
	@IsString()
	make: string;

	@IsString()
	model: string;

	@IsNumber()
	@Min(1930)
	@Max(2050)
	year: number;

	@IsNumber()
	@Min(0)
	@Max(1000000)
	mileage: number;

	@IsLongitude()
	lng: number;

	@IsLatitude()
	lat: number;

	@IsNumber()
	@Min(0)
	@Max(1000000)
	price: number;
}
// GetEstimate
class GetEstimateDto {
	@IsString()
	make: string;

	@IsString()
	model: string;

	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	@Min(1930)
	@Max(2050)
	year: number;

	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	@Min(0)
	@Max(1000000)
	mileage: number;

	@Transform(({ value }) => parseFloat(value))
	@IsLongitude()
	lng: number;

	@Transform(({ value }) => parseFloat(value))
	@IsLatitude()
	lat: number;
}
