const db = require('../config/db');

const companyService = {
  async getCompanyById(companyId) {
    const result = await db.query(
      'SELECT id, name, created_at FROM companies WHERE id = $1',
      [companyId]
    );
    if (result.rows.length === 0) throw new Error('Company not found');
    return result.rows[0];
  },

  async getAllCompanies() {
    const result = await db.query(
      'SELECT id, name, created_at FROM companies ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async updateCompany(companyId, name) {
    const result = await db.query(
      'UPDATE companies SET name = $1 WHERE id = $2 RETURNING id, name',
      [name, companyId]
    );
    if (result.rows.length === 0) throw new Error('Company not found');
    return result.rows[0];
  },

  async getCompanyStats(companyId) {
    const result = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM drivers WHERE company_id = $1) as total_drivers,
        (SELECT COUNT(*) FROM routes r 
         LEFT JOIN drivers d ON r.driver_id = d.id 
         WHERE d.company_id = $1) as total_routes,
        (SELECT COALESCE(AVG(r.risk_score), 0) FROM routes r 
         LEFT JOIN drivers d ON r.driver_id = d.id 
         WHERE d.company_id = $1) as avg_risk_score`,
      [companyId]
    );
    
    return {
      total_drivers: parseInt(result.rows[0].total_drivers) || 0,
      total_routes: parseInt(result.rows[0].total_routes) || 0,
      avg_risk_score: Math.round(parseFloat(result.rows[0].avg_risk_score) || 0)
    };
  }
};

module.exports = companyService;