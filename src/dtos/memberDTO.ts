import { CopyWithPartial, Member } from '../App/types'
import { v4 as uuid } from 'uuid'
import { trim } from 'ramda'

type MemberDTO = CopyWithPartial<Member, 'memberId' | 'timestamp'>

export const memberDTO = (member: MemberDTO): Member => ({
  groupId: member.groupId,
  memberId: member.memberId ?? uuid(),
  timestamp: member.timestamp ?? Date.now(),
  name: trim(member.name),
})
