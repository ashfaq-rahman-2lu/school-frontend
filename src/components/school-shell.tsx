export function SchoolShell({ name }: { name: string }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="school-header">
        <a className="school-mark" href="/" aria-label="School home">
          <svg aria-hidden="true" viewBox="0 0 40 40" width="40" height="40"><path d="M7 9h10c3 0 3 3 3 3s0-3 3-3h10v23H23c-3 0-3 2-3 2s0-2-3-2H7Z" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M20 12v22M11 15h5M24 15h5M11 20h5M24 20h5" stroke="currentColor" strokeWidth="2" /></svg>
          <span>School community</span>
        </a>
        <nav aria-label="School navigation"><a href="/" aria-current="page">Home</a><a href="#school-information">School information</a></nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section className="welcome">
          <div className="welcome-copy"><h1>{name}</h1><p>A place to learn.<br />A community to grow with.</p></div>
          <div className="welcome-note"><span className="note-rule" aria-hidden="true" /><p>Welcome to your school’s online home.</p></div>
        </section>
        <section id="school-information" className="school-information"><h2>School information</h2><p>Online school services are being prepared. Please contact your school directly for help.</p></section>
      </main>
      <footer>Learning brings us together.</footer>
    </>
  );
}

export function UnavailableSchool() {
  return <main id="main-content" className="unavailable"><h1>School unavailable</h1><p>Please try again later.</p></main>;
}
