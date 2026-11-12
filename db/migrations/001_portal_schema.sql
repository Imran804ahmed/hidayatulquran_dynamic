-- Hidayatul Quran admin portal: initial schema (MySQL 5.7+ / MariaDB 10.3+).
-- All DATETIME values are UTC. The website's original tables `registration` and `contactus`
-- are NOT modified; `npm run portal -- import-legacy` copies their rows into hq_* tables.
-- `version` columns implement optimistic locking for concurrent edits.

CREATE TABLE IF NOT EXISTS hq_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin','admin') NOT NULL DEFAULT 'admin',
  status ENUM('active','disabled') NOT NULL DEFAULT 'active',
  last_login_at DATETIME NULL,
  password_changed_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_user_permissions (
  user_id INT UNSIGNED NOT NULL,
  permission VARCHAR(60) NOT NULL,
  PRIMARY KEY (user_id, permission),
  CONSTRAINT fk_perm_user FOREIGN KEY (user_id) REFERENCES hq_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Server-side sessions: the cookie holds a random token, the table holds only its SHA-256 hash.
CREATE TABLE IF NOT EXISTS hq_sessions (
  id CHAR(64) NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  last_seen_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  ip VARCHAR(45) NULL,
  user_agent VARCHAR(255) NULL,
  PRIMARY KEY (id),
  KEY ix_sessions_user (user_id),
  KEY ix_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES hq_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rate limiting for sign-in, password reset and public forms.
CREATE TABLE IF NOT EXISTS hq_rate_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  kind VARCHAR(20) NOT NULL,
  subject_hash CHAR(64) NULL,
  ip VARCHAR(45) NOT NULL,
  success TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY ix_rate_subject (kind, subject_hash, created_at),
  KEY ix_rate_ip (kind, ip, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_password_resets (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reset_token (token_hash),
  KEY ix_reset_user (user_id),
  CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES hq_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_settings (
  setting_key VARCHAR(80) NOT NULL,
  setting_value TEXT NULL,
  updated_by INT UNSIGNED NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_courses (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  summary VARCHAR(500) NULL,
  public_url VARCHAR(255) NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  sort_order INT NOT NULL DEFAULT 0,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_courses_slug (slug),
  UNIQUE KEY uq_courses_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_teachers (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ref_no VARCHAR(20) NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NULL,
  phone VARCHAR(40) NULL,
  country VARCHAR(80) NULL,
  timezone VARCHAR(64) NULL,
  qualifications TEXT NULL,
  specialisations TEXT NULL,
  availability TEXT NULL,
  status ENUM('active','inactive','archived') NOT NULL DEFAULT 'active',
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_teachers_ref (ref_no),
  KEY ix_teachers_status (status),
  KEY ix_teachers_name (full_name),
  KEY ix_teachers_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_registrations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ref_no VARCHAR(20) NULL,
  submission_key VARCHAR(64) NULL,
  legacy_key VARCHAR(80) NULL,
  source_form VARCHAR(80) NOT NULL DEFAULT 'registration.html',
  full_name VARCHAR(150) NOT NULL,
  age TINYINT UNSIGNED NULL,
  country VARCHAR(80) NULL,
  guardian_name VARCHAR(150) NULL,
  whatsapp VARCHAR(40) NULL,
  whatsapp_digits VARCHAR(40) NULL,
  email VARCHAR(190) NULL,
  package VARCHAR(40) NULL,
  classes_plan VARCHAR(20) NULL,
  preferred_days VARCHAR(120) NULL,
  preferred_time VARCHAR(60) NULL,
  message TEXT NULL,
  status ENUM('new','under_review','contacted','approved','enrolled','rejected') NOT NULL DEFAULT 'new',
  rejection_reason VARCHAR(500) NULL,
  assigned_to INT UNSIGNED NULL,
  follow_up_on DATE NULL,
  student_id INT UNSIGNED NULL,
  converted_at DATETIME NULL,
  converted_by INT UNSIGNED NULL,
  confirmation_email ENUM('pending','sent','failed','skipped') NOT NULL DEFAULT 'skipped',
  submitted_at DATETIME NOT NULL,
  submitted_at_known TINYINT(1) NOT NULL DEFAULT 1,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reg_ref (ref_no),
  UNIQUE KEY uq_reg_submission (submission_key),
  UNIQUE KEY uq_reg_legacy (legacy_key),
  KEY ix_reg_status (status, submitted_at),
  KEY ix_reg_submitted (submitted_at),
  KEY ix_reg_email (email),
  KEY ix_reg_wa (whatsapp_digits),
  KEY ix_reg_follow (follow_up_on),
  KEY ix_reg_assigned (assigned_to),
  CONSTRAINT fk_reg_assigned FOREIGN KEY (assigned_to) REFERENCES hq_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_students (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ref_no VARCHAR(20) NULL,
  full_name VARCHAR(150) NOT NULL,
  age TINYINT UNSIGNED NULL,
  guardian_name VARCHAR(150) NULL,
  email VARCHAR(190) NULL,
  whatsapp VARCHAR(40) NULL,
  whatsapp_digits VARCHAR(40) NULL,
  country VARCHAR(80) NULL,
  timezone VARCHAR(64) NULL,
  preferred_days VARCHAR(120) NULL,
  preferred_time VARCHAR(60) NULL,
  status ENUM('active','inactive','archived') NOT NULL DEFAULT 'active',
  registered_at DATETIME NULL,
  source_registration_id INT UNSIGNED NULL,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_students_ref (ref_no),
  KEY ix_students_status (status),
  KEY ix_students_name (full_name),
  KEY ix_students_email (email),
  KEY ix_students_wa (whatsapp_digits),
  KEY ix_students_created (created_at),
  CONSTRAINT fk_student_source_reg FOREIGN KEY (source_registration_id) REFERENCES hq_registrations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_enrolments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_id INT UNSIGNED NOT NULL,
  course_id INT UNSIGNED NOT NULL,
  teacher_id INT UNSIGNED NULL,
  package VARCHAR(40) NULL,
  classes_per_week TINYINT UNSIGNED NULL,
  status ENUM('pending','active','paused','completed','withdrawn') NOT NULL DEFAULT 'pending',
  start_date DATE NULL,
  end_date DATE NULL,
  notes TEXT NULL,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY ix_enrol_student (student_id, status),
  KEY ix_enrol_course (course_id, status),
  KEY ix_enrol_teacher (teacher_id, status),
  CONSTRAINT fk_enrol_student FOREIGN KEY (student_id) REFERENCES hq_students(id),
  CONSTRAINT fk_enrol_course FOREIGN KEY (course_id) REFERENCES hq_courses(id),
  CONSTRAINT fk_enrol_teacher FOREIGN KEY (teacher_id) REFERENCES hq_teachers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Weekly recurring class slot. weekday/start_time are wall-clock values in `timezone` (IANA),
-- so a 17:00 London class stays at 17:00 London time across daylight-saving changes.
CREATE TABLE IF NOT EXISTS hq_class_slots (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  enrolment_id INT UNSIGNED NOT NULL,
  weekday TINYINT UNSIGNED NOT NULL COMMENT '1=Mon .. 7=Sun',
  start_time TIME NOT NULL,
  duration_min SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  timezone VARCHAR(64) NOT NULL,
  status ENUM('scheduled','cancelled') NOT NULL DEFAULT 'scheduled',
  meeting_url VARCHAR(500) NULL,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY ix_slot_enrol (enrolment_id, status),
  KEY ix_slot_day (weekday, start_time),
  CONSTRAINT fk_slot_enrol FOREIGN KEY (enrolment_id) REFERENCES hq_enrolments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_enquiries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ref_no VARCHAR(20) NULL,
  submission_key VARCHAR(64) NULL,
  legacy_key VARCHAR(80) NULL,
  source_form VARCHAR(80) NOT NULL DEFAULT 'Contact form (home page)',
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NULL,
  subject VARCHAR(255) NULL,
  message TEXT NULL,
  status ENUM('new','in_progress','resolved','archived') NOT NULL DEFAULT 'new',
  read_at DATETIME NULL,
  assigned_to INT UNSIGNED NULL,
  follow_up_on DATE NULL,
  confirmation_email ENUM('pending','sent','failed','skipped') NOT NULL DEFAULT 'skipped',
  submitted_at DATETIME NOT NULL,
  submitted_at_known TINYINT(1) NOT NULL DEFAULT 1,
  version INT UNSIGNED NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_enq_ref (ref_no),
  UNIQUE KEY uq_enq_submission (submission_key),
  UNIQUE KEY uq_enq_legacy (legacy_key),
  KEY ix_enq_status (status, submitted_at),
  KEY ix_enq_submitted (submitted_at),
  KEY ix_enq_follow (follow_up_on),
  KEY ix_enq_assigned (assigned_to),
  CONSTRAINT fk_enq_assigned FOREIGN KEY (assigned_to) REFERENCES hq_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Private staff notes (entity_type: student, teacher, registration, enquiry). Never shown publicly.
CREATE TABLE IF NOT EXISTS hq_notes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type VARCHAR(20) NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NULL,
  body TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY ix_notes_entity (entity_type, entity_id, created_at),
  CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES hq_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_status_history (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type VARCHAR(20) NOT NULL,
  entity_id INT UNSIGNED NOT NULL,
  from_status VARCHAR(30) NULL,
  to_status VARCHAR(30) NOT NULL,
  reason VARCHAR(500) NULL,
  user_id INT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY ix_hist_entity (entity_type, entity_id, created_at),
  CONSTRAINT fk_hist_user FOREIGN KEY (user_id) REFERENCES hq_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hq_audit_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NULL,
  action VARCHAR(60) NOT NULL,
  entity_type VARCHAR(20) NULL,
  entity_id INT UNSIGNED NULL,
  summary VARCHAR(500) NOT NULL,
  ip VARCHAR(45) NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY ix_audit_created (created_at),
  KEY ix_audit_entity (entity_type, entity_id),
  KEY ix_audit_user (user_id, created_at),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES hq_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The six courses listed on the public website (src/data/courses.ts).
INSERT IGNORE INTO hq_courses (name, slug, summary, public_url, status, sort_order, created_at, updated_at) VALUES
('Noorani Qaida', 'noorani-qaida', 'Arabic letters, pronunciation and joining rules as a foundation for Quran reading.', '/noorani-qaida-online.html', 'active', 1, UTC_TIMESTAMP(), UTC_TIMESTAMP()),
('Quran Reading Course', 'quran-reading', 'Fluent, correct reading from words to complete verses.', '/quran-reading-course-online.html', 'active', 2, UTC_TIMESTAMP(), UTC_TIMESTAMP()),
('Quran with Tajweed', 'quran-tajweed', 'Tajweed rules such as Ghunna, Qalqalah, Ikhfa, Idgham and Madd.', '/quran-tajweed-course-online.html', 'active', 3, UTC_TIMESTAMP(), UTC_TIMESTAMP()),
('Quran Memorization', 'quran-memorization', 'Structured Hifz with daily lessons and revision cycles.', '/quran-memorization-hifz-online.html', 'active', 4, UTC_TIMESTAMP(), UTC_TIMESTAMP()),
('Tafseer e Quran Course', 'tafseer-quran', 'Meaning and explanation of the Quran.', '/tafseer-quran-course-online.html', 'active', 5, UTC_TIMESTAMP(), UTC_TIMESTAMP()),
('Quranic Arabic Course', 'quranic-arabic', 'Arabic language for understanding the Quran.', '/quranic-arabic-course-online.html', 'active', 6, UTC_TIMESTAMP(), UTC_TIMESTAMP());
