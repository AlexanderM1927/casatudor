// src/utils/MailManager.js
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

class MailManager {
  /**
   * @param {object} options
   * @param {string} options.templatesDir - Carpeta de plantillas (ruta absoluta o relativa al root del proyecto)
   * @param {string} [options.defaultFrom] - Email por defecto del remitente
   * @param {boolean} [options.cache=true] - Cachear plantillas en memoria
   */
  constructor({ templatesDir, defaultFrom, cache = true } = {}) {
    this.templatesDir = path.isAbsolute(templatesDir)
      ? templatesDir
      : path.join(process.cwd(), templatesDir || 'emails/templates');
    this.defaultFrom = defaultFrom || process.env.SMTP_USERNAME;
    this.cacheEnabled = cache;
    this.cache = new Map();
  }
  
  async loadTemplate(templateName) {
    const filePath = path.join(this.templatesDir, `${templateName}.html`);

    if (this.cacheEnabled && this.cache.has(filePath)) {
      return this.cache.get(filePath);
    }

    const html = await fsp.readFile(filePath, 'utf8');
    if (this.cacheEnabled) this.cache.set(filePath, html);
    return html;
  }

  getDeep(obj, keyPath) {
    return keyPath.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : ''), obj);
  }

  interpolate(html, params = {}) {
    return html.replace(/{{\s*([\w.]+)\s*}}/g, (_match, key) => {
      const val = this.getDeep(params, key);
      return (val === null || val === undefined) ? '' : String(val);
    });
  }

  htmlToText(html) {
    return html
      .replace(/\s+/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .trim();
  }

  /**
   * Envía correo usando el plugin de email de Strapi
   * @param {object} payload
   * @param {string|string[]} payload.to
   * @param {string} [payload.from]
   * @param {string|string[]} [payload.cc]
   * @param {string|string[]} [payload.bcc]
   * @param {string} payload.subject
   * @param {string} [payload.template] - Nombre del archivo .html en templatesDir (sin extensión)
   * @param {object} [payload.params] - Parámetros para la plantilla
   * @param {string} [payload.html] - HTML directo (si no quieres usar plantilla)
   * @param {string} [payload.text] - Texto plano; si no se provee y hay html, se genera básico
   * @param {Array} [payload.attachments] - Adjuntos [{ filename, content|path, contentType }]
   * @param {string} [payload.replyTo]
   */
  async send(payload) {
    const {
      to,
      from = this.defaultFrom,
      cc,
      bcc,
      subject,
      template,
      params = {},
      html,
      text,
      attachments,
      replyTo,
    } = payload;

    if (!to) throw new Error('MailManager.send: "to" es obligatorio');
    if (!subject) throw new Error('MailManager.send: "subject" es obligatorio');

    // 1) Obtener HTML final: plantilla + params o html directo
    let finalHtml = html || '';
    if (template) {
      const raw = await this.loadTemplate(template);
      finalHtml = this.interpolate(raw, params);
    }
    if (!finalHtml) throw new Error('MailManager.send: faltan "template" o "html"');

    const finalText = text || this.htmlToText(finalHtml);

    return await strapi.plugin('email').service('email').send({
      to,
      from,
      cc,
      bcc,
      replyTo,
      subject,
      text: finalText,
      html: finalHtml,
      attachments,
    });
  }
}

module.exports = { MailManager };