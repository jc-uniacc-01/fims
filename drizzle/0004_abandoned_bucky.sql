ALTER TABLE "accountRole" RENAME TO "role";--> statement-breakpoint
ALTER TABLE "role" RENAME COLUMN "accountRole" TO "role";--> statement-breakpoint
ALTER TABLE "role" RENAME COLUMN "canAddFaculty" TO "can_add_faculty";--> statement-breakpoint
ALTER TABLE "role" RENAME COLUMN "canModifyFaculty" TO "can_modify_faculty";--> statement-breakpoint
ALTER TABLE "role" RENAME COLUMN "canAddAccount" TO "can_add_account";--> statement-breakpoint
ALTER TABLE "role" RENAME COLUMN "canModifyAccount" TO "can_modify_account";--> statement-breakpoint
ALTER TABLE "role" RENAME COLUMN "canViewChangeLogs" TO "can_view_change_logs";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "accountId" TO "id";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_role_accountRole_accountRole_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_role_role_fk" FOREIGN KEY ("role") REFERENCES "public"."role"("role") ON DELETE no action ON UPDATE no action;