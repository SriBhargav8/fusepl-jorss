CREATE TABLE "certified_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"valuation_id" uuid,
	"user_id" uuid,
	"status" text DEFAULT 'requested',
	"payment_id" text,
	"razorpay_order_id" text,
	"amount" numeric DEFAULT '14999',
	"report_type" text DEFAULT 'rule_11ua',
	"purpose" text,
	"requested_at" timestamp with time zone DEFAULT now(),
	"paid_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"report_url" text,
	"admin_notes" text,
	CONSTRAINT "certified_requests_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
CREATE TABLE "page_events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"session_id" text,
	"event" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"company_name" text,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"source" text DEFAULT 'organic',
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "valuations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email" text,
	"ip_address" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"company_name" text,
	"sector" text NOT NULL,
	"stage" text NOT NULL,
	"business_model" text,
	"city" text,
	"founding_year" integer,
	"team_size" integer,
	"founder_experience" integer,
	"domain_expertise" integer,
	"previous_exits" boolean DEFAULT false,
	"technical_cofounder" boolean DEFAULT false,
	"key_hires" jsonb DEFAULT '[]'::jsonb,
	"annual_revenue" numeric,
	"revenue_growth_pct" numeric,
	"gross_margin_pct" numeric,
	"monthly_burn" numeric,
	"cash_in_bank" numeric,
	"cac" numeric,
	"ltv" numeric,
	"last_round_size" numeric,
	"last_round_valuation" numeric,
	"tam" numeric,
	"dev_stage" text,
	"competition_level" integer,
	"competitive_advantages" jsonb DEFAULT '[]'::jsonb,
	"patents_count" integer DEFAULT 0,
	"strategic_partnerships" text DEFAULT 'none',
	"regulatory_risk" integer DEFAULT 3,
	"revenue_concentration_pct" numeric,
	"international_revenue_pct" numeric DEFAULT '0',
	"esop_pool_pct" numeric,
	"time_to_liquidity_years" integer DEFAULT 4,
	"current_cap_table" jsonb,
	"target_raise" numeric,
	"expected_dilution_pct" numeric,
	"valuation_low" numeric,
	"valuation_mid" numeric,
	"valuation_high" numeric,
	"confidence_score" integer,
	"method_results" jsonb,
	"monte_carlo_percentiles" jsonb,
	"damodaran_inputs" jsonb,
	"ibc_recovery_range" jsonb,
	"esop_valuation" jsonb,
	"investor_matches" jsonb,
	"ai_narrative" text,
	"purpose" text,
	"paid_purpose" text,
	"version" integer DEFAULT 1,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "certified_requests" ADD CONSTRAINT "certified_requests_valuation_id_valuations_id_fk" FOREIGN KEY ("valuation_id") REFERENCES "public"."valuations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certified_requests" ADD CONSTRAINT "certified_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valuations" ADD CONSTRAINT "valuations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_certified_status" ON "certified_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_events_session" ON "page_events" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_events_event" ON "page_events" USING btree ("event");--> statement-breakpoint
CREATE INDEX "idx_valuations_sector" ON "valuations" USING btree ("sector");--> statement-breakpoint
CREATE INDEX "idx_valuations_stage" ON "valuations" USING btree ("stage");--> statement-breakpoint
CREATE INDEX "idx_valuations_created" ON "valuations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_valuations_city" ON "valuations" USING btree ("city");