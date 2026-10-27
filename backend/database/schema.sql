
BEGIN;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash TEXT,
    role VARCHAR(30) NOT NULL DEFAULT 'READER'
        CHECK (role IN ('READER', 'AUTHOR', 'PUBLISHER', 'EDITOR', 'ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'CLOSED')),
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE books (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    author_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    cover_storage_key TEXT,
    publication_status VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
        CHECK (
            publication_status IN (
                'DRAFT', 'IN_REVIEW', 'APPROVED',
                'PUBLISHED', 'REJECTED', 'ARCHIVED'
            )
        ),
    is_subscription_eligible BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_books_catalog
    ON books (publication_status, category, title);

CREATE TABLE book_files (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    book_id BIGINT NOT NULL REFERENCES books(id),
    format VARCHAR(10) NOT NULL
        CHECK (format IN ('PDF', 'EPUB')),
    storage_key TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (book_id, format, storage_key)
);

CREATE TABLE book_rights (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    book_id BIGINT NOT NULL REFERENCES books(id),
    rights_holder_id BIGINT NOT NULL REFERENCES users(id),
    license_type VARCHAR(50) NOT NULL,
    valid_from DATE NOT NULL,
    valid_until DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'ACTIVE', 'EXPIRED', 'REVOKED')),
    evidence_storage_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (valid_until IS NULL OR valid_until >= valid_from)
);

CREATE TABLE subscription_plans (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    price_idr BIGINT NOT NULL CHECK (price_idr >= 0),
    billing_interval VARCHAR(20) NOT NULL DEFAULT 'MONTH'
        CHECK (billing_interval IN ('MONTH')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    plan_id BIGINT NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (
            status IN (
                'PENDING', 'ACTIVE', 'PAST_DUE',
                'CANCELED', 'EXPIRED'
            )
        ),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    provider_subscription_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (
        current_period_end IS NULL
        OR current_period_start IS NULL
        OR current_period_end > current_period_start
    )
);

CREATE INDEX idx_subscriptions_user_status
    ON subscriptions (user_id, status, current_period_end);

CREATE TABLE payment_transactions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    subscription_id BIGINT REFERENCES subscriptions(id),
    transaction_type VARCHAR(30) NOT NULL
        CHECK (transaction_type IN ('SUBSCRIPTION', 'PUBLISHING')),
    provider VARCHAR(50) NOT NULL,
    provider_transaction_id TEXT,
    amount_idr BIGINT NOT NULL CHECK (amount_idr >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (
            status IN (
                'PENDING', 'PAID', 'FAILED',
                'EXPIRED', 'REFUNDED'
            )
        ),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_transaction_id)
);

CREATE INDEX idx_payment_transactions_user
    ON payment_transactions (user_id, created_at DESC);

CREATE TABLE publishing_submissions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    applicant_id BIGINT NOT NULL REFERENCES users(id),
    manuscript_title VARCHAR(250) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    manuscript_storage_key TEXT,
    rights_confirmed_at TIMESTAMPTZ,
    status VARCHAR(25) NOT NULL DEFAULT 'SUBMITTED'
        CHECK (
            status IN (
                'DRAFT', 'SUBMITTED', 'IN_REVIEW',
                'REVISION_REQUIRED', 'ACCEPTED',
                'REJECTED', 'PUBLISHED', 'WITHDRAWN'
            )
        ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE editorial_reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    submission_id BIGINT NOT NULL
        REFERENCES publishing_submissions(id),
    reviewer_id BIGINT NOT NULL REFERENCES users(id),
    decision VARCHAR(25) NOT NULL
        CHECK (
            decision IN (
                'IN_REVIEW', 'REVISION_REQUIRED',
                'ACCEPTED', 'REJECTED'
            )
        ),
    notes TEXT NOT NULL DEFAULT '',
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id TEXT,
    request_id TEXT,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_created_at
    ON audit_logs (created_at DESC);

-- Paket demo. Harga perlu dikonfirmasi sebelum digunakan
-- untuk transaksi nyata.
INSERT INTO subscription_plans (name, description, price_idr)
VALUES
    ('Basic', 'Paket langganan Basic bulanan', 29000),
    ('Premium', 'Paket langganan Premium bulanan', 59000)
ON CONFLICT (name) DO NOTHING;

COMMIT;
