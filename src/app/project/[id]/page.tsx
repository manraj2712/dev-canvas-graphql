import { ProjectInterface } from "@/common/types";
import Modal from "@/components/modal";
import { getProjectDetails } from "@/graphql/methods";
import { getCurrentServerSession } from "@/lib/session";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import RelatedProjects from "@/components/relatedProjects";
import ProjectActions from "@/components/projectActions";

const personDescriptions = [
  "Software Developer",
  "UI/UX Designer",
  "Product Manager",
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
];

const Project = async ({ params: { id } }: { params: { id: string } }) => {
  const session = await getCurrentServerSession();
  const res = (await getProjectDetails(id)) as { project?: ProjectInterface };
  if (!res?.project) {
    return <h1>Failed to fetch project information</h1>;
  }
  const projectDetails = res.project;
  const renderLink = () => `/profile/${projectDetails.createdBy?.id}`;
  return (
    <Modal>
      <section className="flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full">
        <div className="flex-1 flex items-start gap-5 w-full max-xs:flex-col">
          <Link href={renderLink()}>
            <Image
              src={projectDetails?.createdBy?.avatarUrl}
              width={50}
              height={50}
              alt="profile"
              className="rounded-full"
            />
          </Link>

          <div className="flex-1 flexStart flex-col gap-1">
            <p className="self-start text-lg font-semibold">
              {projectDetails?.title}
            </p>
            <div className="user-info">
              <Link href={renderLink()}>{projectDetails?.createdBy?.name}</Link>
              <Image src="/dot.svg" width={4} height={4} alt="dot" />
              <Link
                href={`/?category=${projectDetails.category}`}
                className="text-primary-purple font-semibold"
              >
                {projectDetails?.category}
              </Link>
            </div>
          </div>
        </div>

        {session?.user?.email === projectDetails?.createdBy?.email && (
          <div className="flex justify-items-end items-center gap-2">
            <ProjectActions projectId={projectDetails?.id} />
          </div>
        )}
        {session?.user?.email !== projectDetails?.createdBy?.email && (
          <a
            href={`mailto:${projectDetails.createdBy.email}`}
            className="mt-4 px-5 py-3 text-sm sm:text-base rounded-3xl bg-black text-white mx-auto"
          >
            Work with me
          </a>
        )}
      </section>

      <section className="mt-14 flexCenter">
        <Image
          src={`${projectDetails?.image}`}
          className="object-cover rounded-2xl"
          width={1064}
          height={798}
          alt="poster"
        />
      </section>

      <section className="flexCenter flex-col mt-20">
        <p className="max-w-5xl text-xl font-normal">
          {projectDetails?.description}
        </p>

        <div className="flex flex-wrap mt-5 gap-5">
          <Link
            href={projectDetails?.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flexCenter gap-2 tex-sm font-medium text-primary-purple"
          >
            🖥 <span className="underline">Github</span>
          </Link>
          <Image src="/dot.svg" width={4} height={4} alt="dot" />
          <Link
            href={projectDetails?.liveSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="flexCenter gap-2 tex-sm font-medium text-primary-purple"
          >
            🚀 <span className="underline">Live Site</span>
          </Link>
        </div>
      </section>

      <section className="flexCenter w-full gap-8 mt-28">
        <span className="w-full h-0.5 bg-light-white-200" />
        <Link href={renderLink()} className="min-w-[82px] h-[82px]">
          <Image
            src={projectDetails?.createdBy?.avatarUrl}
            className="rounded-full"
            width={82}
            height={82}
            alt="profile image"
          />
        </Link>
        <span className="w-full h-0.5 bg-light-white-200" />
      </section>
      <div className="mt-5 flex flex-col justify-center text-center">
        <p className="text-base font-semibold">
          {projectDetails.createdBy.name}
        </p>
        <p>
          {
            personDescriptions[
              Math.floor(Math.random() * personDescriptions.length)
            ]
          }
        </p>
        <a
          href={`mailto:${projectDetails.createdBy.email}`}
          className="mt-4 px-5 py-3 text-sm sm:text-base rounded-3xl bg-black text-white mx-auto"
        >
          Work with me
        </a>
      </div>

      <RelatedProjects
        userId={projectDetails?.createdBy?.id}
        projectId={projectDetails?.id}
      />
    </Modal>
  );
};

export default Project;
