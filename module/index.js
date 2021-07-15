/* global Application, game, getTemplate, Hooks */
class ManualPage extends Application {
  constructor (options = {}) {
    super(options)
    if (typeof options.defaultPage !== 'undefined') {
      this.defaultPage = options.defaultPage
    } else {
      this.defaultPage = game.i18n.localize('TEMPLATES.ManualPage')
    }
  }

  static get defaultOptions () {
    const options = super.defaultOptions
    const h = window.innerHeight * 0.9
    const w = Math.min(window.innerWidth * 0.9, 1200)
    options.height = h
    options.width = w
    options.top = (window.innerHeight - h) / 2
    options.left = (window.innerWidth - w) / 2
    options.title = game.i18n.localize('TITLES.ManualPage')
    options.id = 'CoC7ManualContainer'
    options.template = 'modules/CoC7-helper/templates/instructions.html'
    return options
  }

  async activateListeners (html) {
    $('#CoC7ManualPage').on('click', 'a', async function () {
      const button = $(this)
      const template = await getTemplate(button.data('template'))
      $('#CoC7ManualPage').html(template)
    })
    const template = await getTemplate(this.defaultPage)
    $('#CoC7ManualPage').html(template)
  }
}

class CoC7SystemHelper {
  init () {
    game.settings.register('CoC7-helper', 'tt-delay', {
      name: 'SETTINGS.TTDelay',
      scope: 'world',
      config: true,
      type: Number,
      default: 1000
    })
    game.settings.register('CoC7-helper', 'tt-generic', {
      name: 'SETTINGS.TTGeneric',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true
    })

    Hooks.on('renderSettings', (settings, html, data) => this.renderSettings(settings, html, data))
  }

  ready () {
    window.addEventListener('mousemove', this.setTooltipPosition)

    Hooks.on('renderCoC7CharacterSheetV2', (actor, html, data) => this.renderCoC7CharacterSheetV2(actor, html, data))
    Hooks.on('renderCoC7NPCSheet', (actor, html, data) => this.renderCoC7NPCAndCreatureSheet(actor, html, data))
    Hooks.on('renderCoC7CreatureSheet', (actor, html, data) => this.renderCoC7NPCAndCreatureSheet(actor, html, data))
  }

  setTooltipPosition (e) {
    const tooltip = $('.coc7-helper-tooltip')
    if (tooltip.length === 0) {
      return
    }
    tooltip.css('top', (e.clientY + 20) + 'px')
    tooltip.css('left', (e.clientX - tooltip.width() / 2) + 'px')
  }

  renderSettings (settings, html, data) {
    html.find('#settings-documentation').append('<button class="generic-help"><i class="fab fa-readme"></i> ' + game.i18n.localize('TITLES.CoC7') + '</button>')
    html.find('.generic-help').click(this.clickHelp.bind(this))
  }

  clickHelp (event) {
    new ManualPage().render(true)
  }

  clickCharacterSheetV2Help (event) {
    new ManualPage({
      defaultPage: 'modules/CoC7-helper/instructions/en/character_creation.html'
    }).render(true)
  }

  renderCoC7CharacterSheetV2 (actor, html, data) {
    html.append('<a class="generic-help"><i class="fas fa-question"></i></a>')
    html.find('.skill-name.rollable').mouseenter(this.prepareSkillName.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.characteristic-label').mouseenter(this.prepareSkillName.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.auto-toggle').mouseenter(this.prepareAutoToggle.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.attribute-label.rollable').mouseenter(this.prepareAttributeLabel.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.weapon-name.rollable').mouseenter(this.prepareWeaponName.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.weapon-damage').mouseenter(this.prepareWeaponDamage.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.generic-help').mouseenter(this.prepareCharacterGenericHelp.bind(this)).mouseleave(this.removeTooltip.bind(this)).click(this.clickCharacterSheetV2Help.bind(this))
  }

  renderCoC7NPCAndCreatureSheet (actor, html, data) {
    html.find('.skill-name.rollable').mouseenter(this.prepareSkillName.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.characteristic-label').mouseenter(this.prepareSkillName.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.attribute-label.rollable').mouseenter(this.prepareAttributeLabel.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.weapon-name.rollable').mouseenter(this.prepareWeaponName.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.weapon-damage').mouseenter(this.prepareWeaponDamage.bind(this)).mouseleave(this.removeTooltip.bind(this))
    html.find('.weapon-skill.rollable').mouseenter(this.prepareWeaponSkill.bind(this)).mouseleave(this.removeTooltip.bind(this))
  }

  prepareSkillName (event) {
    this.addTooltip(
      '<h2>Skill checks</h2>' +
      '<p><strong>Left click</strong> Skill check with options</p>' +
      '<p><strong>Shift + Left click</strong> Immediate regular difficult skill check roll</p>' +
      '<h2>Opposed skill checks</h2>' +
      '<p><strong>Right click</strong> Opposed skill check with options</p>' +
      '<p><strong>Shift + Right click</strong> Immediate opposed skill check</p>' +
      '<h2>Combined skill checks</h2>' +
      '<p><strong>Alt + Right click</strong> Opposed skill check with options</p>' +
      (game.user.isGM ? '<h2>Keeper checks</h2><p><strong>CTRL + Left click</strong> Create skill roll link</p>' : '')
    )
  }

  prepareAutoToggle (event) {
    this.addTooltip(
      '<p><strong>Left click</strong> Toggle automatic calculation / manual entry</p>'
    )
  }

  prepareAttributeLabel (event) {
    const attrib = event.currentTarget.parentElement.dataset.attrib
    switch (attrib) {
      case 'db':
        this.addTooltip(
          '<p><strong>Left click</strong> Roll bonus damage</p>'
        )
        break
      case 'lck':
        this.addTooltip(
          '<h2>Luck checks</h2>' +
          '<p><strong>Left click</strong> Luck check with options</p>' +
          '<p><strong>Shift + Left click</strong> Immediate regular difficult luck check roll</p>' +
          '<h2>Opposed luck checks</h2>' +
          '<p><strong>Right click</strong> Opposed luck check with options</p>' +
          '<p><strong>Shift + Right click</strong> Immediate opposed luck check</p>' +
          '<h2>Combined luck checks</h2>' +
          '<p><strong>Alt + Right click</strong> Opposed luck check with options</p>' +
          (game.user.isGM ? '<h2>Keeper checks</h2><p><strong>CTRL + Left click</strong> Create luck roll link</p>' : '')
        )
        break
      case 'san':
        this.addTooltip(
          '<h2>Sanity checks</h2>' +
          '<p><strong>Left click</strong> Sanity check with options</p>' +
          '<p><strong>Shift + Left click</strong> Immediate regular difficult sanity check roll</p>' +
          '<h2>Opposed sanity checks</h2>' +
          '<p><strong>Right click</strong> Opposed sanity check with options</p>' +
          '<p><strong>Shift + Right click</strong> Immediate opposed sanity check</p>' +
          '<h2>Combined sanity checks</h2>' +
          '<p><strong>Alt + Right click</strong> Opposed sanity check with options</p>' +
          (game.user.isGM ? '<h2>Keeper checks</h2><p><strong>CTRL + Left click</strong> Create sanity roll link</p><p><strong>CTRL + ALT + Left click</strong> Create sanity check link</p>' : '')
        )
        break
    }
  }

  prepareWeaponName (event) {
    this.addTooltip(
      '<h2>Combat checks</h2>' +
      '<p><strong>Left click</strong> Skill check with options</p>' +
      '<h2>Opposed combat checks</h2>' +
      '<p><strong>Right click</strong> Opposed combat check with options</p>' +
      '<p><strong>Shift + Right click</strong> Immediate opposed combat check</p>' +
      '<h2>Combined combat checks</h2>' +
      '<p><strong>Alt + Right click</strong> Opposed combat check with options</p>' +
      (game.user.isGM ? '<h2>Keeper checks</h2><p><strong>CTRL + Left click</strong> Create combat roll link</p>' : '')
    )
  }

  prepareWeaponDamage (event) {
    this.addTooltip(
      '<p><strong>Left click</strong> Roll damage chat message</p>' +
      '<p><strong>Shift + Left click</strong> Immediately roll damage chat message</p>'
    )
  }

  prepareWeaponSkill (event) {
    this.addTooltip(
      '<p><strong>Left click</strong> Skill check with options</p>' +
      '<p><strong>Shift + Left click</strong> Immediate regular difficult skill check roll</p>'
    )
  }

  prepareCharacterGenericHelp (event) {
    this.addTooltip(
      '<p>Check the documentation to find out how to do the following.</p>' +
      '<ul><li>Change Font</li><li>Create Occupations</li><li>Create Skills</li></ul>'
    )
  }

  addTooltip (text) {
    const delay = parseInt(game.settings.get('CoC7-helper', 'tt-delay'))
    if (delay > 0) {
      var template = '<div class="coc7-helper-tooltip"><div class="tooltiptext">' + text + '</div></div>'
      $('body').append(template)
      this.timer = setTimeout(function () {
        $('.coc7-helper-tooltip').show()
      }, delay)
    }
  }

  removeTooltip (event) {
    $('.coc7-helper-tooltip').remove()
    clearTimeout(this.timer)
  }
}

const CoC7SystemHelperModule = new CoC7SystemHelper()
Hooks.on('ready', function () {
  CoC7SystemHelperModule.ready()
})
Hooks.once('init', function () {
  CoC7SystemHelperModule.init()
})
