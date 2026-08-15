import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = process.cwd();
const migrationsDirectory = resolve(repositoryRoot, "supabase", "migrations");
const schemaPath = resolve(repositoryRoot, "supabase", "schema.sql");

function migrationFiles() {
  if (!existsSync(migrationsDirectory)) return [];
  return readdirSync(migrationsDirectory);
}

function hardeningMigration() {
  const filename = migrationFiles().find((file) =>
    /^\d{14}_harden_site_content_rls\.sql$/.test(file),
  );

  return filename
    ? readFileSync(resolve(migrationsDirectory, filename), "utf8")
    : "";
}

describe("site_content RLS repository contract", () => {
  it("ships a dedicated hardening migration", () => {
    expect(migrationFiles()).toEqual(
      expect.arrayContaining([expect.stringMatching(/^\d{14}_harden_site_content_rls\.sql$/)]),
    );
  });

  it("fails closed while installing the private UID-based authorization model", () => {
    const migration = hardeningMigration();

    expect(migration).toContain("begin;");
    expect(migration).toContain("if current_user <> 'postgres'");
    expect(migration).toContain("app_private schema already exists");
    expect(migration).toContain("create schema app_private authorization postgres");
    expect(migration).toContain("create table app_private.admin_users");
    expect(migration).toContain("create function app_private.is_site_admin()");
    expect(migration).toContain("security definer");
    expect(migration).toContain("set search_path = ''");
    expect(migration).toContain("(select auth.uid())");
    expect(migration).toContain("revoke all on table public.site_content from anon, authenticated");
    expect(migration).toContain("grant select, insert, update on table public.site_content to authenticated");
    expect(migration).toContain("site_content_admin_insert");
    expect(migration).toContain("site_content_admin_update");
    expect(migration).not.toContain("where email =");
    expect(migration).not.toContain("for all to authenticated");
    expect(migration).not.toContain("for delete");
  });

  it("keeps the canonical schema aligned with UID-based, private authorization", () => {
    const schema = readFileSync(schemaPath, "utf8");

    expect(schema).toContain("create schema app_private authorization postgres");
    expect(schema).toContain("create table app_private.admin_users");
    expect(schema).toContain("create function app_private.is_site_admin()");
    expect(schema).toContain("security definer");
    expect(schema).toContain("set search_path = ''");
    expect(schema).toContain("auth.uid()");
    expect(schema).toContain("revoke all on table public.site_content from anon, authenticated");
    expect(schema).toContain("grant select, insert, update on table public.site_content to authenticated");
    expect(schema).toContain('for insert');
    expect(schema).toContain('for update');
    expect(schema).not.toContain('for delete');
    expect(schema).not.toContain('for all to authenticated');
    expect(schema).not.toContain('where email =');
  });
});
