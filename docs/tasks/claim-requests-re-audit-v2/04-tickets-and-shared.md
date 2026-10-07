# Tickets branch and mounted shared controls — fresh audit

Status: complete after source inspection, implementation, focused tests, typecheck, lint and diff checks. Earlier Claim Requests tasks are historical; they do not establish complete parity.

## Verified discrepancies and implementation tasks

- [x] T1: Restore `ClaimRequestReadonlyInfoList`, `ClaimRequestInfoListContent`, `ClaimRequestInfoListCard`, and `ClaimPersonValue` from `insurance-ui/src/features/claim-requests/components/`. Target `TicketRelatedClaimRequestColumn` currently substitutes a name and untranslated status badge for the entire three-row source information list. Preserve every field, separator, source amount/date interpretation, disease lookup, fraud badge, and translation.
- [x] T2: Restore the readonly closure of `AssessmentItemsCardList`, `AssessmentItemCard`, `AssessmentItemCardRowData`, `AssessmentItemCardAdjustment`, and `AssessmentItemCardFanavarnCalc`. Target `ReadonlyAssessmentItems` currently has a reduced card, displays missing amounts as dashes, omits floating coverage, jaw-quarter labels, adjustment information, calculation results, skeleton cards and description overflow behavior. Preserve only mounted readonly behavior; editing controls belong outside this page.
- [x] T3: Restore related assessment query timing and canonical services, including source after-calculation and conditional sub-insured queries. Preserve claim request details query and `size='xs'` management link.
- [x] T4: Opt mounted ticket buttons/badges into reference presentation. Ticket status buttons currently add `min-h-11`; source has no minimum height. Source missing text uses ASCII `-`, while ticket columns use en dashes.
- [x] T5: Add scoped reference Sheet presentation. Source uses black overlay, unpadded content, 4px header padding scale, small top-left close icon, and source title/description typography. Shared target defaults currently apply elevated surface, content padding, different overlay and large close target.
- [x] T6: Correct scoped shared confirmations forwarding `onOpenChange` while loading, and `TwoLineCell` source secondary font weight/truncation location. Preserve default consumers.

## Compared component inventory

`ClaimRequestsTicketsPage`, `TicketsContent`, `TicketsDataTableToolbar`, `TicketStatusFilter`, `useTicketColumns`, `TicketRowActions`, `TicketDetailSheet`, `TicketDetailSheetHeader`, `TicketCommunicationColumn`, `TicketReadonlyDetail`, `TicketMessageList`, `TicketMessage`, `TicketDetailSheetActions`, `TicketStatusHistoryDialog`, `TicketRelatedClaimRequestColumn`, and the T1/T2 closure above. Direct ticket detail query enabling, initial row data, message payload, close/message success sequencing, and loading/error/empty branches were compared against their actual reference files. Accessibility-only attributes are retained.

## Acceptance and evidence

Compare real source files, exercise readonly populated/empty/loading branches and source services, run affected tests, workspace typecheck/lint and diff checks. Source inspection and unit tests cannot establish pixel identity or live backend behavior; browser and backend verification must be reported separately.

Additional completion evidence: `readonly-card-parity.test.tsx` renders the
public UI primitives and verifies readonly floating coverage, adjustment and
Fanavaran sections, absent amount rows, source quantity fallback and jaw-quarter
labels. Both tests pass. Only LongText overflow measurement is replaced in this
focused test; tooltip context and card primitives are real.

The doc-type cache shape collision found during integration was resolved with a
content-specific query key suffix; page-response consumers retain their keys.
