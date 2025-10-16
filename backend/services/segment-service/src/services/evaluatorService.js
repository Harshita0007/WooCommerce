// ============================================
const { Op } = require('sequelize');
const Product = require('../models/Product');

class EvaluatorService {
  parseCondition(line) {
    const trimmed = line.trim();
    if (!trimmed) return null;

    const patterns = [
      { regex: /^(\w+)\s*(>=|<=|!=|=|>|<)\s*(.+)$/, type: 'comparison' },
      { regex: /^(\w+)\s+contains\s+(.+)$/i, type: 'contains' }
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern.regex);
      if (match) {
        if (pattern.type === 'comparison') {
          return {
            field: match[1],
            operator: match[2],
            value: match[3].trim()
          };
        } else if (pattern.type === 'contains') {
          return {
            field: match[1],
            operator: 'contains',
            value: match[2].trim()
          };
        }
      }
    }

    throw new Error(`Invalid condition format: ${trimmed}`);
  }

  buildWhereClause(conditions) {
    const where = {};

    for (const condition of conditions) {
      const { field, operator, value } = condition;

      let parsedValue = value;
      
      if (typeof value === 'string') {
        parsedValue = value.replace(/^["']|["']$/g, '');
      }

      if (!isNaN(parsedValue) && parsedValue !== '') {
        parsedValue = parseFloat(parsedValue);
      }

      if (parsedValue === 'true') parsedValue = true;
      if (parsedValue === 'false') parsedValue = false;

      switch (operator) {
        case '=':
          where[field] = parsedValue;
          break;
        case '!=':
          where[field] = { [Op.ne]: parsedValue };
          break;
        case '>':
          where[field] = { [Op.gt]: parsedValue };
          break;
        case '<':
          where[field] = { [Op.lt]: parsedValue };
          break;
        case '>=':
          where[field] = { [Op.gte]: parsedValue };
          break;
        case '<=':
          where[field] = { [Op.lte]: parsedValue };
          break;
        case 'contains':
          where[field] = { [Op.like]: `%${parsedValue}%` };
          break;
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    }

    return where;
  }

  async evaluate(rulesText) {
    try {
      const lines = rulesText.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('No valid conditions provided');
      }

      const conditions = lines.map(line => this.parseCondition(line)).filter(c => c !== null);
      
      if (conditions.length === 0) {
        throw new Error('No valid conditions could be parsed');
      }

      const whereClause = this.buildWhereClause(conditions);
      
      const products = await Product.findAll({
        where: whereClause,
        order: [['id', 'ASC']]
      });

      return {
        success: true,
        conditions: conditions,
        count: products.length,
        data: products
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new EvaluatorService();