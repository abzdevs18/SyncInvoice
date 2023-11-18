import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role: string, subject: string, user: any) => {
  const { can, rules, cannot } = new AbilityBuilder(AppAbility)

  if (role === 'Admin') {
    can('manage', 'all')
  } else if (role === 'Student') {
    can('manage', 'common-page')
    can('manage', 'home-page')
    can('read', 'Comment')
    can('manage', 'invoice-page')
    can('manage', 'subject-page')
    can('manage', 'chat-page')
    can('manage', 'report-card-page')
    if (user) {
      can('create', 'Post')
      can(['update', 'delete'], 'Post', { ownerId: user.id })
    }
    cannot('manage', 'qr-page')
  } else if (role === 'Registrar') {
    can('manage', 'all')
    can('manage', 'ecom-page')
    can('manage', 'check-subject-attendance')
    cannot('manage', 'qr-page')
  } else if (role === 'Teacher') {
    can('manage', 'all')
  } else if (role === 'Guard') {
    can('manage', 'all')
    can('manage', 'score-card')
    can('manage', 'qr-page')
    cannot('manage', 'check-subject-attendance')
    cannot('manage', 'subject-page')
    cannot('manage', 'invoice-page')
    cannot('manage', 'chat-page')
    cannot('manage', 'report-card-page')
  }

  return rules
}

export const buildAbilityFor = (role: string, subject: string, userId: any): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject, userId), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
