"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import { Icon } from "./icons";

export function Contact() {
  const [copyStatus, setCopyStatus] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus("Email copied");
    } catch {
      setCopyStatus("Copy unavailable. Use the email link to get in touch.");
    }
  }
  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="container contact-grid">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-heading">
            Let’s talk about
            <br />
            software quality<span>.</span>
          </h2>
          <p>
            For conversations about QA leadership, automation, and testing
            strategy.
          </p>
          <p className="contact-location">{profile.location}</p>
        </div>
        <div className="contact-links">
          <div className="contact-email">
            <span className="eyebrow">Email</span>
            <a href={`mailto:${profile.email}`}>
              {profile.email}
              <Icon name="external" />
            </a>
            <button className="copy-email" onClick={copyEmail}>
              <Icon name={copyStatus === "Email copied" ? "check" : "copy"} />
              {copyStatus === "Email copied" ? "Copied" : "Copy email"}
            </button>
            <span className="copy-status" role="status">
              {copyStatus}
            </span>
          </div>
          <a
            className="social-link"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>LinkedIn</span>
            <span className="eyebrow">
              Connect <Icon name="external" />
            </span>
          </a>
          <a
            className="social-link"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>GitHub</span>
            <span className="eyebrow">
              View profile <Icon name="external" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
