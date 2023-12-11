import { Req } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { Request } from "express";
import { Role } from "global/guards.decorator";

@ValidatorConstraint({ name: "customText", async: false })
export class ValidationUserAccess implements ValidatorConstraintInterface {
	validate(roles: any, args: ValidationArguments) {
		console.log({ roles });
		console.log({ args });
		return true;
	}

	defaultMessage(args: ValidationArguments) {
		// here you can provide default error message if validation failed
		return "Text ($value) is too short or too long!";
	}
}
