# Neon Readiness Contract

**Document Version**: 1.0  
**Date**: May 3, 2026  
**Status**: Pre-Neon (Neon not yet connected)

This document defines the contract and rules for integrating Neon as the production database backend for the Cane Corso Platform.

---

## Current State

- **Database Backend**: PostgreSQL (currently local or staging)
- **Neon Connection**: Not yet active
- **Migration Tool**: Drizzle ORM
- **Connection Management**: Environment-based (DATABASE_URL)

---

## Future Integration Rules

### 1. Connection String Management

#### Runtime Connection (Application)

- **Environment Variable**: `DATABASE_URL`
- **Type**: Pooled connection string (recommended for HTTP app serverless context)
- **Neon Format**: Includes `-pooler` in the hostname
  ```
  postgresql://user:password@host-pooler.neon.tech/database?sslmode=require
  ```
- **Usage**: All application queries (page loads, API endpoints, mutations)
- **Security**:
  - Must be loaded from environment, never hardcoded
  - Must not be logged
  - Must not be exposed in client-side bundles (no NEXT_PUBLIC_*)

#### Migration Connection (Direct / Non-Pooled)

- **Environment Variable**: `DATABASE_URL_DIRECT` or `DIRECT_DATABASE_URL`
- **Type**: Direct (non-pooled) connection string
- **Neon Format**: Standard hostname (no "-pooler")
  ```
  postgresql://user:password@host.neon.tech/database?sslmode=require
  ```
- **Usage**: Database migrations, schema changes, administrative tasks
- **Reason**: Neon pooled connections don't support long-running transactions or DDL (Data Definition Language) operations required by migrations
- **Security**:
  - Must be loaded from environment, never hardcoded
  - Must not be exposed in code
  - Should be restricted to deployment/admin contexts only

### 2. Neon Pooled Connection Specifics

- **Hostname Pattern**: `*.neon.tech-pooler.neon.tech`
- **Port**: 5432 (default PostgreSQL)
- **Pooling Type**: PgBouncer (connection pooling proxy)
- **Limitations**:
  - Does NOT support long-running transactions
  - Does NOT support DDL (CREATE TABLE, ALTER TABLE, DROP, etc.)
  - Does NOT support transaction isolation levels beyond simple
  - Suitable for HTTP request/response cycles

### 3. Direct Connection Specifics

- **Hostname Pattern**: `*.neon.tech`
- **Port**: 5432 (default PostgreSQL)
- **Pooling Type**: None (direct connection to Postgres)
- **Advantages**:
  - Supports DDL operations (migrations)
  - Supports long transactions (if needed)
  - Supports advanced transaction isolation
- **Usage**: Migrations, administrative operations, one-time scripts

### 4. Migration Strategy

#### Before Neon Connection

- [ ] All migrations in `packages/db/drizzle/migrations/` are applied to local/staging database
- [ ] Migration files are append-only (never rewrite old migrations)
- [ ] Migration filenames follow order: `0001_`, `0002_`, etc.
- [ ] No destructive migrations (DROP TABLE, TRUNCATE, etc.) exist without explicit approval

#### At Neon Connection Time

1. Obtain Neon project credentials
2. Generate `DATABASE_URL` (pooled) and `DATABASE_URL_DIRECT` (direct)
3. Store both in `.env` (local) and deployment environment secrets
4. Run migrations using `DATABASE_URL_DIRECT`:
   ```bash
   DATABASE_URL_DIRECT=<direct-connection> pnpm db:migrate
   ```
5. Verify all migrations applied successfully
6. Test application using `DATABASE_URL` (pooled)

#### Migration Rollback

- Neon does not automatically support rollback
- Rollback requires manual SQL scripting or data restoration from backup
- Always backup before applying new migrations to production

### 5. Connection Pool Sizing

**For Serverless / HTTP App**:
- Recommended pool size: 20-30 connections
- Neon default: 100 connections (adequate for most workloads)
- Monitor connection usage in Neon dashboard

**For Migrations**:
- Use direct connection (single connection at a time)
- No pooling needed

### 6. Secrets Management

#### Required Secrets (Must Never Be Committed)

- `DATABASE_URL` — Pooled connection string
- `DATABASE_URL_DIRECT` — Direct connection string (if using separate connections)
- `AUTH_SECRET` — Application JWT/session signing key
- Other sensitive API keys (payment processors, email services, etc.)

#### Storage

- **Local Development**: `.env` file (git-ignored)
- **CI/CD**: Secure environment secret store (GitHub Actions Secrets, etc.)
- **Production**: Deployment platform secret management (Vercel, Render, Railway, etc.)

#### Validation

- [ ] No real connection string appears in git history
- [ ] No real AUTH_SECRET appears in code
- [ ] .env and .env.local are in .gitignore
- [ ] .env.example documents required variables (without real values)

### 7. Data Consistency

#### Transactions

- Application should use appropriate transaction isolation levels
- Pooled connections support SERIALIZABLE if needed (check Neon support)
- Migrations run with implicit transaction wrapping

#### Foreign Keys

- All foreign key constraints should be defined in schema
- Cascading deletes/updates should be explicit in schema
- Soft deletes (logical deletes with flag) preferred for audit trail

### 8. Backup and Recovery

#### Neon Built-in Features

- **Automated Backups**: Neon provides automatic daily backups (default retention: 7 days)
- **Point-in-Time Recovery**: Available up to last 7 days (or longer with higher plan)
- **Backup Format**: PostgreSQL WAL (Write-Ahead Logs) and snapshots

#### Application Responsibility

- [ ] Document recovery procedure
- [ ] Test recovery procedure quarterly
- [ ] Monitor backup status in Neon dashboard
- [ ] Define RTO (Recovery Time Objective) and RPO (Recovery Point Objective)

### 9. Monitoring and Performance

#### Key Metrics to Monitor

- Connection count (approaching pool size limit?)
- Query performance (slow queries?)
- Transaction duration
- Lock contention
- Storage usage

#### Tools

- Neon Dashboard: Connection, storage, and compute metrics
- Application logging: Query duration, error rates
- APM (Application Performance Monitoring): Optional (Datadog, New Relic, etc.)

### 10. Schema Evolution

#### Approved Patterns

1. **Add column**: Always allowed (with default value)
2. **Rename column**: Two-step (rename, then update references)
3. **Add constraint**: Allowed if backfilled data satisfies constraint
4. **Rename table**: Similar to column rename (two-step)

#### Restricted Patterns

1. **Drop column**: Requires explicit approval (data loss)
2. **Drop table**: Requires explicit approval (data loss)
3. **Drop schema**: Requires explicit approval (data loss)
4. **Destructive type changes**: Requires explicit approval (data loss)
5. **Truncate table**: Never without explicit approval

#### Approval Process

- Submit PR with migration file
- Document reason for destructive change
- Confirm no production data loss expected
- Require 2+ approvals from senior engineers

### 11. Disaster Recovery Plan

#### In Case of Database Corruption

1. **Detect**: Monitor error logs and test queries
2. **Alert**: Notify on-call engineer immediately
3. **Isolate**: Disable application writes (read-only mode if possible)
4. **Assess**: Determine scope of corruption
5. **Restore**: Use Neon point-in-time recovery to a known good state
6. **Verify**: Test restored data
7. **Resume**: Resume normal operations
8. **Investigate**: Root cause analysis
9. **Document**: Update runbooks

#### Estimated RTO: 15–30 minutes  
#### Estimated RPO: Last 7 days (default Neon retention)

### 12. Pre-Production Checklist

Before connecting to production Neon:

- [ ] All migrations tested on staging
- [ ] Connection strings obtained from Neon console
- [ ] DATABASE_URL (pooled) added to deployment secrets
- [ ] DATABASE_URL_DIRECT (direct) added to deployment secrets
- [ ] AUTH_SECRET configured for production
- [ ] Backup retention configured in Neon
- [ ] Monitoring alerts configured
- [ ] Recovery procedure documented and tested
- [ ] Load testing passed (if applicable)
- [ ] Security audit passed
- [ ] DBA review completed
- [ ] Deployment runbook created

---

## Environment Variable Template

### .env.example (No Real Values)

```env
# PostgreSQL connection (pooled for app)
DATABASE_URL=postgresql://user:password@hostname-pooler.neon.tech/database?sslmode=require

# PostgreSQL connection (direct for migrations, optional)
# DATABASE_URL_DIRECT=postgresql://user:password@hostname.neon.tech/database?sslmode=require

# Application JWT/session secret
AUTH_SECRET=your-secure-random-secret-here

# Other environment variables...
NODE_ENV=production
```

---

## Neon Pricing Considerations

- **Compute**: Pay per compute unit per hour (auto-scale or fixed)
- **Storage**: Pay per GB per month
- **Connections**: Pooling included (unlimited connections via pooler)
- **Backups**: Included (up to 7 days retention)
- **Branching**: Paid feature (useful for staging/testing)

---

## Security Best Practices

1. **Use PgBouncer pooling** (Neon default) for HTTP serverless contexts
2. **Use direct connection** for migrations and administrative tasks
3. **Rotate credentials** regularly (quarterly recommended)
4. **Limit access** to Neon console (IP whitelist, RBAC)
5. **Enable SSL/TLS** for all connections (Neon default)
6. **Monitor query logs** for suspicious activity
7. **Never expose credentials** in logs, error messages, or client-side code
8. **Use read-only database users** for read-only services (if separating concerns)

---

## Rollback Plan

If Neon integration fails:

1. Revert to previous database backend (local PostgreSQL or previous provider)
2. Verify application data consistency
3. Update connection strings in environment
4. Test thoroughly before resuming production traffic
5. Document failure cause and remediation

---

## Glossary

- **Pooled Connection**: Handled by PgBouncer proxy; suitable for short HTTP requests
- **Direct Connection**: Direct to PostgreSQL; required for migrations and long transactions
- **DDL**: Data Definition Language (CREATE, ALTER, DROP statements)
- **WAL**: Write-Ahead Logging; PostgreSQL mechanism for durability
- **RTO**: Recovery Time Objective; target time to restore service
- **RPO**: Recovery Point Objective; target maximum data loss

---

## Contact and Support

- **Neon Support**: support@neon.tech
- **Neon Documentation**: https://neon.tech/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

**Document Status**: Ready for review  
**Next Review Date**: After Neon connection is established
